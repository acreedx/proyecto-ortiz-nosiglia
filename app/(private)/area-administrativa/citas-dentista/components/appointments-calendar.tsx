"use client";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {
  DateSelectArg,
  EventChangeArg,
  EventClickArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import { useState } from "react";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import { useDialog } from "@chakra-ui/react";
import AppointmentsCreateCalendarForm from "../../citas/components/appointments-create-calendar-form";
import { MockAppointment } from "../page";
import { statusColorMap } from "../../../../(public)/citas/components/appointments-accordion";
import { User } from "@prisma/client";
function convertirAppointmentsAEventos(
  appointments: MockAppointment[]
): EventInput[] {
  return appointments.map((appt) => {
    const start = new Date(`${appt.date}T${appt.time}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    return {
      id: appt.id,
      title: `${appt.patientName}`,
      start,
      end,
      allDay: false,
      color: statusColorMap[appt.status] || "gray",
    };
  });
}
export default function AppointmentsCalendar({
  MockAppointments,
  patients,
}: {
  MockAppointments: MockAppointment[];
  patients: User[];
}) {
  const [selectedDate, setselectedDate] = useState<Date>();
  const createAppointmentDialog = useDialog();
  const viewAppointmentDialog = useDialog();
  const [MockEvents, setMockEvents] = useState<EventInput[]>(
    convertirAppointmentsAEventos(MockAppointments)
  );
  const handleEventChange = async (e: EventChangeArg) => {
    const evento = e.event;
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Desea cambiar la fecha de esta cita?",
    });
    if (isConfirmed) {
      setMockEvents((prevEvents) =>
        prevEvents.map((ev) =>
          ev.id === evento.id
            ? {
                ...ev,
                start: evento.start!,
                end: evento.end!,
              }
            : ev
        )
      );
    } else {
      e.revert();
    }
  };
  const handleDateSelect = async (e: DateSelectArg) => {
    const fechaElegida = e.start;
    fechaElegida.setHours(16, 0, 0, 0);
    setselectedDate(fechaElegida);
    createAppointmentDialog.setOpen(true);
    /*
    const nuevoEvento = {
      id: `evt-${Date.now()}`,
      title: "Evento nuevo",
      allDay: false,
      start: fechaElegida,
      end: new Date(fechaElegida.getTime() + 30 * 60 * 1000),
    };
    setMockEvents((prevEvents) => [...prevEvents, nuevoEvento]);
    console.log(MockEvents);*/
    //todo crear un nuevo evento
  };
  const handleClickEvent = async (event: EventClickArg) => {
    const eventoEncontrado = MockEvents.find((e) => e.id === event.event.id);
    viewAppointmentDialog.setOpen(true);
    console.log(eventoEncontrado);
    //todo mostrar evento del calendario
  };
  return (
    <div className="w-3/4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth,listMonth",
        }}
        height={"100%"}
        initialView="dayGridMonth"
        selectable={true}
        editable={true}
        eventChange={handleEventChange}
        eventResizableFromStart={false}
        eventDurationEditable={false}
        select={handleDateSelect}
        locale={esLocale}
        slotMinTime="08:00:00"
        slotMaxTime="17:00:00"
        events={MockEvents}
        eventClick={handleClickEvent}
      />
      <EditDialog dialog={createAppointmentDialog}>
        <AppointmentsCreateCalendarForm
          props={{ pacientes: patients, selectedDate: selectedDate }}
        />
      </EditDialog>
      <EditDialog dialog={viewAppointmentDialog}>
        Ver información de la cita
      </EditDialog>
    </div>
  );
}
