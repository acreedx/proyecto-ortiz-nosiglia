"use client";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
export default function AppointmentsCalendar() {
  return (
    <div className="w-1/2">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
      />
    </div>
  );
}
