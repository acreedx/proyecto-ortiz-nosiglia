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
import {
  mostrarAlertaConfirmacion,
  mostrarAlertaError,
} from "../../../../../lib/sweetalert/alerts";
import { UseDialogReturn } from "@chakra-ui/react";
import { Appointment, Prisma } from "@prisma/client";
import { convertirAppointmentsAEventos } from "../../../../../types/appointmentStatusMaps";
import { updateAppointmentDateTime } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
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
    //todo validar que el estado de la cita sea el correcto y que la fecha no sea anterior
    const eventoEncontrado = props.appointments.find(
      (e) => e.id === Number(e.id)
    );
    if (e.event.start) {
      const isConfirmed = await mostrarAlertaConfirmacion({
        mensaje: "Desea cambiar la fecha de esta cita?",
      });
      if (isConfirmed) {
        const res = await updateAppointmentDateTime({
          appointmentId: Number(e.event.id),
          newDate: e.event.start,
        });
        if (res.ok) {
          toaster.create({
            description: "Éxito al actualizar la fecha de la cita",
            type: "success",
          });
        } else {
          toaster.create({
            description: "Error al actualizar la fecha de la cita",
            type: "error",
          });
        }
      } else {
        e.revert();
      }
    }
  };
  const isTodayOrFuture = (date: Date) => {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    date.setUTCHours(0, 0, 0, 0);
    return date.getTime() >= today.getTime();
  };
  const handleDateSelect = async (e: DateSelectArg) => {
    if (isTodayOrFuture(e.start)) {
      props.setselectedDate(e.start);
      props.createAppointmentDialog.setOpen(true);
    } else {
      mostrarAlertaError({
        mensaje: "No se puede crear una cita en una fecha anterior",
      });
    }
  };
  const handleClickEvent = async (event: EventClickArg) => {
    const eventoEncontrado = props.appointments.find(
      (e) => e.id === Number(event.event.id)
    );
    props.setselectedAppointment(eventoEncontrado);
    props.viewAppointmentDialog.setOpen(true);
  };
  return (
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
  );
}
