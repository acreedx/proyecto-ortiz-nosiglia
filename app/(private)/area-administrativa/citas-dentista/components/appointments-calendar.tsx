"use client";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { useState } from "react";
export default function AppointmentsCalendar() {
  const [selectedDate, setselectedDate] = useState<Date>();
  const handleDateSelect = (e: DateSelectArg) => {
    setselectedDate(e.start);
    console.log(e);
  };
  const handleClickEvent = (e: EventClickArg) => {
    console.log(e.event.start);
    console.log(e.event.end);
  };
  const MockEvents: EventInput[] = [
    {
      title: "Evento nuevo",
      allDay: false,
      start: new Date(),
      end: new Date(new Date().getTime() + 30 * 60 * 1000),
    },
  ];
  return (
    <div className="w-1/2">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth,listMonth",
        }}
        initialView="dayGridMonth"
        selectable={true}
        select={handleDateSelect}
        locale={esLocale}
        slotMinTime="08:00:00"
        slotMaxTime="17:00:00"
        weekends={false}
        events={MockEvents}
        eventClick={handleClickEvent}
      />
    </div>
  );
}
