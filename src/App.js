import React, { useState } from "react";
import Calendar from "./Calendar";
import Modal from "./components/Modal/Modal";
import { events as eventData } from "./data/events";
import dayjs, { Dayjs } from "dayjs";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

const now = () => new Date();

const App = () => {
  const [allEvents, setAllEvents] = useState(eventData);
  const [showModal, setShowModal] = useState(false);
  const [start, setStart] = useState();
  const [end, setEnd] = useState();
  const [date, setDate] = useState(dayjs(new Date()));
  const [view, setView] = useState("month");

  const onNavigate = (newDate) => {
    setDate(newDate);
  };
  const onView = (newView) => setView(newView);

  const eventStyleGetter = (event, start, end, isSelected) => {
    console.log(event);
    var backgroundColor = event.color;
    var style = {
      backgroundColor: backgroundColor,
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
    console.log("on select", { start, end, action });
    setShowModal(true);
    setStart(start);
    setEnd(end);
  };

  const onSelectEvent = (event) => {
    console.log("onSelectEvent: ", event);
  };

  const onDoubleClickEvent = (event) => {
    console.log("onDoubleClickEvent: ", event);
  };

  const moveEvent = ({ event, start, end, isAllDay: droppedOnAllDaySlot }) => {
    let allDay = event.allDay;

    if (!event.allDay && droppedOnAllDaySlot) {
      allDay = true;
    } else if (event.allDay && !droppedOnAllDaySlot) {
      allDay = false;
    }

    const updatedEvent = { ...event, start, end, allDay };

    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((it) => it.id !== event.id);
      return [...filtered, updatedEvent];
    });
  };

  const resizeEvent = ({ event, start, end }) => {
    setAllEvents((prevEvents) => {
      const filtered = prevEvents.filter((it) => it.id !== event.id);
      return [...filtered, { ...event, start, end }];
    });

    //alert(`${event.title} was resized to ${start}-${end}`)
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

  const handleAddNewEvent = (event) => {
    setAllEvents([...allEvents, event]);
  };
  // const [value, setValue] = React.useState(dayjs(new Date()));
  return (
    <div className="App" style={{ height: "100vh", display: "flex" }}>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        style={{ width: "25vw" }}
      >
        <StaticDatePicker
          displayStaticWrapperAs="desktop"
          openTo="day"
          value={date}
          onChange={(newValue) => {
            setDate(dayjs(newValue).format());
          }}
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
          // dayPropGetter,
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
  );
};
export default App;
