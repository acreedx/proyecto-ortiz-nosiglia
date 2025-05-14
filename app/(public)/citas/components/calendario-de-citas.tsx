"use client";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";

export default function CalendarioDeCitas() {
  return (
    <div className="w-full flex flex-col rounded-sm border border-stroke bg-white p-8 text-black shadow-default h-full">
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
      />
    </div>
  );
}
