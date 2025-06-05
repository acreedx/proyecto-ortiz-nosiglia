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
} from "@fullcalendar/core/index.js";
import { SetStateAction } from "react";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { UseDialogReturn } from "@chakra-ui/react";
import { Appointment, Prisma } from "@prisma/client";
import { convertirAppointmentsAEventos } from "../../../../../types/appointmentStatusMaps";
export default function AppointmentsCalendar({
  props,
}: {
  props: {
    appointments: Prisma.AppointmentGetPayload<{
      include: {
        patient: {
          include: {
            user: true;
          };
        };
        doctor: {
          include: {
            staff: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    }>[];
    setselectedDate: React.Dispatch<SetStateAction<Date | undefined>>;
    createAppointmentDialog: UseDialogReturn;
    editAppointmentDialog: UseDialogReturn;
    completeAppointmentDialog: UseDialogReturn;
    cancelAppointmentDialog: UseDialogReturn;
    viewAppointmentDialog: UseDialogReturn;
    setselectedAppointment: React.Dispatch<
      React.SetStateAction<Appointment | undefined>
    >;
  };
}) {
  const handleEventChange = async (e: EventChangeArg) => {
    //const evento = e.event;
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Desea cambiar la fecha de esta cita?",
    });
    if (isConfirmed) {
      //todo actualizar la fecha de la cita
    } else {
      e.revert();
    }
  };
  const handleDateSelect = async (e: DateSelectArg) => {
    const fechaElegida = e.start;
    fechaElegida.setUTCHours(16, 0, 0, 0);
    props.setselectedDate(fechaElegida);
    props.createAppointmentDialog.setOpen(true);
  };
  const handleClickEvent = async (event: EventClickArg) => {
    const eventoEncontrado = props.appointments.find(
      (e) => e.id === Number(event.event.id)
    );
    props.setselectedAppointment(eventoEncontrado);
    props.viewAppointmentDialog.setOpen(true);
    //todo mostrar evento del calendario
  };
  return (
    <div className="w-3/4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
        timeZone="UTC"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "timeGridDay,timeGridWeek,dayGridMonth,listMonth",
        }}
        height={"auto"}
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
        events={convertirAppointmentsAEventos(props.appointments)}
        eventClick={handleClickEvent}
      />
    </div>
  );
}
