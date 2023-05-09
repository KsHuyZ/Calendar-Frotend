import React, { useRef, useState } from "react";
import Calendar from "../../components/Calendar/Calendar";
import Modal from "../../components/Modal/Modal";
import dayjs from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { AuthContext } from "../../context/AuthProvider";
import { useContext, useEffect } from "react";
import { notfifyError, notifyPending, notifySuccess } from "../../lib/toastify";
import imageDenied from "../../assets/images/access-denied.svg";
import ModalDetail from "../../components/ModalDetail/ModalDetail";
import socket from "../../config/socket";
import { useParams } from "react-router-dom";
import "./home.scss";
import { TbShare } from "react-icons/tb";
import ModalShare from "../../components/ModalShare/ModalShare";
import { toast } from "react-toastify";
import { Map } from "../../services/goong";
import { BsChatRightText } from "react-icons/bs";
import { eventApi } from "../../api/eventApi";
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
  const [event, setEvent] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalDetail, setShowModalDetail] = useState(false);
  const [showModalShare, setShowModalShare] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [view, setView] = useState("month");
  const [permission, setPermission] = useState(false);
  const { user, setProgress } = useContext(AuthContext);
  const { getEventbyCalendarId } = eventApi;
  const [loaded, setLoaded] = useState(false);
  const [userOnline, setUserOnline] = useState([]);
  const { id, year, month, day } = useParams();
  const [date, setDate] = useState(year ? new Date(`${year}/${month}/${day}`) : now());

  const toastId = useRef(null);

  const notifyLoading = (msg) => (toastId.current = toast.loading(msg));
  const update = (msg, type) =>
    toast.update(toastId.current, {
      render: msg,
      type: type,
      isLoading: false,
      autoClose: true,
      closeOnClick: true,
      closeButton: true,
    });

  const handleGetMySchedule = async () => {
    setProgress(30);
    const year = date.getFullYear();
    try {
      if (user._id) {
        const res = await getEventbyCalendarId(id, year);
        if (res.success) {
          setPermission(true);
          setAllEvents(res.events);
          socket.emit("join-schedule", id);
          setLoaded(true);
          return setProgress(100);
        } else {
          setPermission(false);
          setProgress(100);
          return setLoaded(true)
        }
      }
      setAllEvents([]);
      return setProgress(100);
    } catch (error) {
      console.log(error)
      setPermission(false);
      setProgress(100);
    }
  };

  const handleDeleteEvent = (idEvent) => {
    const oldEvent = allEvents.filter((event) => event._id === idEvent);
    try {
      socket.emit("delete-event", { idEvent });
      notifyLoading("Deleting...");
    } catch (error) {
      setAllEvents((prev) => prev.push(oldEvent));
    }
  };

  const handleAddNewEvent = (
    title,
    backgroundColor,
    description,
    start,
    end,
    location,
    file,
    isMeeting
  ) => {
    const event = {
      title,
      calendarId: id,
      backgroundColor,
      description,
      start,
      end,
      location: location,
      file,
      isMeeting
    };
    socket.emit("create-event", event);
    notifyLoading("Creating...");
  };

  useEffect(() => {
    socket.on("create-success", (event) => {
      update("Created", "success");
      setAllEvents((prev) => [...prev, event]);
    });

    socket.on("delete-success", (id) => {
      console.log("delete", id)
      setAllEvents((pre) => pre.filter((event) => event._id !== id));
      update("Deleted", "success");
    });

    socket.on("update-success", () => {
      update("Updated", "success");
    });

    socket.on("update-error", () => {
      update("Update Error", "error");
    });

    socket.on("new-user", (user) => {
      setUserOnline((prev) => prev.push(user));
    });

    socket.on("new-event", (event) => setAllEvents((prev) => [...prev, event]));

    socket.on("new-event-update", ({ id, startDay, endDay }) => {
      setAllEvents((pre) => {
        const eventIndex = pre.findIndex((e) => e._id === id);
        let arrayEvents = pre.slice();
        arrayEvents[eventIndex].start = startDay;
        arrayEvents[eventIndex].end = endDay;
        return arrayEvents;
      });
    });

    socket.on("new-user-join", (users) => {
      console.log(users);
      setUserOnline(users);
    });

    socket.on("user-join-event", ({ user, eventId }) => {
      setAllEvents((prev) => {
        const index = prev.findIndex((e) => (e._id = eventId));
        let coppyEvents = prev.slice();
        coppyEvents[index] = {
          ...coppyEvents[index],
          userJoin: coppyEvents[index].userJoin
            ? [...coppyEvents[index].userJoin, user]
            : [user],
        };
        return coppyEvents;
      });
    });
    return () => {
      socket.off("create-success");
      socket.off("delete-success");
      socket.off("update-success");
      socket.off("update-error");
      socket.off("new-event");
      socket.off("new-event-update");
      socket.off("new-user");
      socket.off("new-user-join");
      socket.off("user-join-event");
    };
  }, [socket]);

  useEffect(() => {
    handleGetMySchedule();
  }, [user, id]);

  const onNavigate = (newDate) => {
    const newValue = dayjs(newDate).toDate();

    const day = newValue.getDate()
    const month = newValue.getMonth() + 1
    const year = newValue.getFullYear()

    const url = new URL(window.location.href);
    url.pathname = `/${id}/${year}/${month}/${day}`;
    window.history.pushState({}, ``, url.toString());
    setDate((prev) => {
      if (prev.getFullYear() !== newValue.getFullYear()) {
        handleGetMySchedule();
        return newValue;
      }
      return newValue;
    });
  };
  const onView = (newView) => setView(newView);

  const eventStyleGetter = (event, start, end, isSelected) => {
    var backgroundColor = event?.backgroundColor;
    const color = backgroundColor?.startsWith("#f") ? "black" : "white";

    var style = {
      backgroundColor: backgroundColor,
      color,
      boxShadow:
        "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    };
    return {
      style: style,
    };
  };

  const accessors = {
    draggableAccessor: (event) => !event.blocked,
    resizableAccessor: (event) => !event.blocked,
    startAccessor: (event) => new Date(event.start),
    endAccessor: (event) => new Date(event.end),
  };

  const onSelectSlot = ({ start, end, action }) => {
    setShowModal(true);
    setStart(start);
    setEnd(end);
  };

  const onSelectEvent = (event) => {
    setEvent(event);
    setShowModalDetail(true);
  };

  const onDoubleClickEvent = (event) => {
    console.log("onDoubleClickEvent: ", event);
  };

  const moveEvent = async ({
    event,
    start,
    end,
    isAllDay: droppedOnAllDaySlot,
  }) => {
    let allDay = event.allDay;
    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }
    const updatedEvent = {
      ...event,
      start: start.toISOString(),
      end: end.toISOString(),
      allDay,
    };
    const eventIndex = allEvents.findIndex((e) => e._id === event._id);
    const lastEvent = allEvents[eventIndex];
    if (
      lastEvent.start === start.toISOString() &&
      lastEvent.end === end.toISOString()
    )
      return;
    setEvent(event);
    socket.emit("update-time", {
      startDay: start.toISOString(),
      endDay: end.toISOString(),
      id: event._id,
    });
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((it) => it._id !== event._id);
      return [...filtered, updatedEvent];
    });
    notifyLoading("Updating...");
  };

  const resizeEvent = ({ event, start, end }) => {
    const eventIndex = allEvents.findIndex((e) => e._id === event._id);
    const lastEvent = allEvents[eventIndex];
    const startDay = isIsoDate(start) ? start : start.toISOString();
    const endDay = isIsoDate(end) ? end : end.toISOString();
    if (lastEvent.start === startDay && lastEvent.end === endDay) return;
    socket.emit("update-time", { startDay, endDay, id: event._id });
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((it) => it._id !== event._id);
      return [...filtered, { ...event, start: startDay, end: endDay }];
    });
    notifyLoading("Updating...");
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
  };

  const onSelecting = (range) => {
    console.log("[onSelecting] range: ", range);
  };

  return (
    <>
      <div className="tools-side">
        <div className="online-show">
          {userOnline.map((user) => {
            var randomColor = Math.floor(Math.random() * 16777215).toString(16);
            return (
              <div className="user">
                <img
                  src={user.photoURL}
                  alt=""
                  style={{ border: `#${randomColor} 3px solid` }}
                />
              </div>
            );
          })}
        </div>
        <BsChatRightText />
      </div>

      <div className="home">
        <Modal
          close={setShowModal}
          start={start}
          end={end}
          add={handleAddNewEvent}
          show={showModal}
        />

        <ModalShare
          close={() => setShowModalShare(false)}
          show={showModalShare}
          type="permission"
        />
        <ModalDetail
          close={setShowModalDetail}
          event={event}
          dele={handleDeleteEvent}
          show={showModalDetail}
        />
        {loaded ? (
          permission ? (
            <>
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
              <div className="right-side">
                <div className="calendar-date">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StaticDatePicker
                      displayStaticWrapperAs="desktop"
                      openTo="day"
                      value={date}
                      onChange={(newValue) => {
                        onNavigate(newValue);
                      }}
                      onMonthChange={(value) => onNavigate(value)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </div>
                <div
                  className="item"
                  onClick={() => setShowModalShare(!showModalShare)}
                >
                  <div className="item-content">
                    <div className="item-option">
                      <div className="title-item">
                        <TbShare />
                        <div>Share for user</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="access-denied">
              <img src={imageDenied} alt="" />
              <p>You haven't permission</p>
            </div>
          )
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default Home;
