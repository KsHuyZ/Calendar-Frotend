import React, { useState } from "react";
import { Calendar as Cal, momentLocalizer } from "react-big-calendar";
import moment from "../../config/moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
// import MyWorkWeek from "./MyWorkWeek";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

const DragAndDropCalendar = withDragAndDrop(Cal);

const Calendar = ({
  events,
  date = new Date(),
  onNavigate,
  view = "week",
  onView,
  views = {
    day: true,
    month: true,
    week: true,
    // myweek: MyWorkWeek,
  },
  getNow = () => new Date(),
  accessors,
  selectable = false,
  onSelectSlot,
  ...props
}) => {
  const localizer = momentLocalizer(moment);

  return (
    <DragAndDropCalendar
      style={{ width: "80%" }}
      {...{
        events,
        localizer,
        date,
        onNavigate,
        view,
        onView,
        views,
        getNow,
        accessors,
        selectable,
        onSelectSlot,
      }}
      messages={{
        myweek: "My Week",
      }}
      resizable
      {...props}
    />
  );
};

export default Calendar;
