import React, { useState } from 'react'
import Calendar from "../../components/Calendar/Calendar";
import Modal from "../../components/Modal/Modal";
import { events as eventData } from "../../data/events";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { scheduleApi } from '../../api/scheduleApi';
import { AuthContext } from '../../context/AuthProvider';
import { useContext } from 'react';
import { useEffect } from 'react';
import { eventApi } from '../../api/eventApi';
import { notifyPending } from '../../lib/toastify';
import ModalDetail from '../../components/ModalDetail/ModalDetail';
import socket from '../../config/socket';
import { useParams } from 'react-router-dom';

const now = () => new Date();

function isEmpty(obj) {
    for (var prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }

    return JSON.stringify(obj) === JSON.stringify({});
}

function isIsoDate(str) {
    if (!/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/.test(str)) return false;
    const d = new Date(str);
    return d instanceof Date && !isNaN(d) && d.toISOString() === str; // valid date 
}

const Home = () => {
    const [allEvents, setAllEvents] = useState([]);
    const [event, setEvent] = useState({})
    const [showModal, setShowModal] = useState(false);
    const [showModalDetail, setShowModalDetail] = useState(false)
    const [start, setStart] = useState();
    const [end, setEnd] = useState();
    const [date, setDate] = useState(now());
    const [view, setView] = useState("month");
    const [idSchdule, setIdSchedule] = useState()
    const { user, setProgress } = useContext(AuthContext)
    const { getSchedulebyUser } = scheduleApi
    const { createEvent, updateTimeEvent, deleteEvent } = eventApi

    const { id } = useParams()

    const handleGetMySchedule = async () => {
        setProgress(30)
        const year = date.getFullYear()
        if (user.id) {
            try {
                const res = await getSchedulebyUser(id, user.id, year)
                setAllEvents(res.events)
                socket.emit("join-schedule", res.id)
                setIdSchedule(res.id)
                setProgress(100)
            } catch (error) {
                
            }
      
        }
    }

    const handleDeleteEvent = (id) => {
        const oldEvent = allEvents.filter((event) => event._id === id)
        try {
            const newEvents = allEvents.filter((event) => event._id !== id)
            setAllEvents(newEvents)
            notifyPending("Deleting", "Deleted", "Delete Error", deleteEvent(id))
        } catch (error) {
            setAllEvents(prev => prev.push(oldEvent))
        }
    }

    useEffect(() => {
        handleGetMySchedule()
    }, [user])

    const onNavigate = (newDate) => {
        const newValue = dayjs(newDate).toDate()
        setDate((prev) => {
            if (prev.getFullYear() !== newValue.getFullYear()) {
                handleGetMySchedule()
                return newValue
            }
            return newValue
        });
    };
    const onView = (newView) => setView(newView);

    const eventStyleGetter = (event, start, end, isSelected) => {
        var backgroundColor = event.backgroundColor;
        const color = backgroundColor.startsWith("#f") ? "black" : "white"

        var style = {
            backgroundColor: backgroundColor,
            color,
            boxShadow: "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px"
        };
        return {
            style: style,
        };
    };

    const accessors = {
        draggableAccessor: (event) => !event.blocked,
        resizableAccessor: (event) => !event.blocked,
    };

    const onSelectSlot = ({ start, end, action }) => {
        setShowModal(true);
        setStart(start);
        setEnd(end);
    };

    const onSelectEvent = (event) => {
        setEvent(event)
        setShowModalDetail(true)
    };

    const onDoubleClickEvent = (event) => {
        console.log("onDoubleClickEvent: ", event);
    };

    const moveEvent = async ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
        let allDay = event.allDay;
        if (!event.allDay && droppedOnAllDaySlot) {
            allDay = true;
        } else if (event.allDay && !droppedOnAllDaySlot) {
            allDay = false;
        }
        const updatedEvent = { ...event, start: start.toISOString(), end: end.toISOString(), allDay };
        const eventIndex = allEvents.findIndex((e) => e._id === event._id)
        const lastEvent = allEvents[eventIndex]
        if (lastEvent.start === start.toISOString() && lastEvent.end === end.toISOString()) return
        try {
            setAllEvents((prevEvents) => {
                const filtered = prevEvents.filter((it) => it._id !== event._id);
                return [...filtered, updatedEvent];
            });
            notifyPending("Updating...", "Saved", "Update Error", updateTimeEvent(event._id, start, end))
        } catch (error) {
            setAllEvents((prevEvents) => {
                const filtered = prevEvents.filter((it) => it._id !== event._id);
                return [...filtered, lastEvent];
            });
        }
    };

    const resizeEvent = ({ event, start, end }) => {
        const eventIndex = allEvents.findIndex((e) => e._id === event._id)
        const lastEvent = allEvents[eventIndex]
        const startDay = isIsoDate(start) ? start : start.toISOString()
        const endDay = isIsoDate(end) ? end : end.toISOString()
        if (lastEvent.start === startDay && lastEvent.end === endDay) return
        try {
            setAllEvents((prevEvents) => {
                const filtered = prevEvents.filter((it) => it._id !== event._id);
                return [...filtered, { ...event, start: startDay, end: endDay }];
            });
            notifyPending("Updating...", "Saved", "Update Error", updateTimeEvent(event._id, start, end))
        } catch (error) {
            setAllEvents((prevEvents) => {
                const filtered = prevEvents.filter((it) => it._id !== event._id);
                return [...filtered, lastEvent];
            });
        }
    };

    const onKeyPressEvent = ({ event, ...other }) => {
        console.log("[onKeyPressEvent] - event", event);
        console.log("[onKeyPressEvent] - other", other);
    };

    const onDragStart = ({ event, action }) => {
        const { id } = event;
        if (id === 5) {
            return false;
        }
        //console.log(`onDragStart: ${action}`, event);
    };

    const onSelecting = (range) => {
        console.log("[onSelecting] range: ", range);
    };

    const handleAddNewEvent = async (
        id,
        title,
        backgroundColor,
        description,
        start,
        end,
    ) => {
        let allEventsTest = [...allEvents, { _id: id, title, idSchdule, backgroundColor, description, start, end, createdBy: user.id }]
        setAllEvents(allEventsTest)
        try {
            await createEvent(title, idSchdule, backgroundColor, description, start, end, user.id).then(res => {
                if (!res.success) {
                    const array = allEventsTest.filter((event) => event._id !== id)
                    return setAllEvents(array)
                }
                const eventIndex = allEventsTest.findIndex(event => event._id === id)
                allEventsTest[eventIndex]._id = res.id
                setAllEvents(allEventsTest)
                return
            })
        } catch (error) {
            console.log(error)
        }
    };


    return (
        <div style={{ height: "100vh", display: "flex" }}>
            <LocalizationProvider
                dateAdapter={AdapterDayjs}
                style={{ width: "20%" }}
            >
                <StaticDatePicker
                    displayStaticWrapperAs="desktop"
                    openTo="day"
                    value={date}
                    onChange={(newValue) => {
                        onNavigate(newValue)
                    }}
                    onMonthChange={(value) => onNavigate(value)

                    }
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            {showModal && (
                <Modal
                    close={setShowModal}
                    start={start}
                    end={end}
                    add={handleAddNewEvent}
                />
            )}
            {showModalDetail && <ModalDetail close={setShowModalDetail} event={event} dele={handleDeleteEvent} />}
            <Calendar
                {...{
                    date,
                    onNavigate,
                    view,
                    onView,
                    onSelectSlot,
                    onSelectEvent,
                    onSelecting,
                    onDoubleClickEvent,
                    onKeyPressEvent,
                }}
                events={allEvents}
                onEventDrop={moveEvent}
                onEventResize={resizeEvent}
                eventPropGetter={eventStyleGetter}
                getNow={now}
                {...accessors}
                selectable="ignoreEvents"
            />
        </div>

    )
}

export default Home