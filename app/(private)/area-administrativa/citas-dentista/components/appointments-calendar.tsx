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
import { Dispatch, SetStateAction } from "react";
import {
  mostrarAlertaConfirmacion,
  mostrarAlertaError,
} from "../../../../../lib/sweetalert/alerts";
import { UseDialogReturn } from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { convertirAppointmentsAEventos } from "../../../../../types/appointmentStatusMaps";
import { updateAppointmentDateTime } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import { appointmentStatusList } from "../../../../../types/statusList";
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
    setselectedAppointment: Dispatch<
      SetStateAction<
        | Prisma.AppointmentGetPayload<{
            include: {
              patient: { include: { user: true } };
              doctor: { include: { staff: { include: { user: true } } } };
            };
          }>
        | undefined
      >
    >;
  };
}) {
  function normalizarFecha(fecha: Date) {
    return new Date(
      fecha.getFullYear(),
      fecha.getMonth(),
      fecha.getDate(),
      fecha.getUTCHours(),
      fecha.getUTCMinutes()
    );
  }
  const handleEventChange = async (e: EventChangeArg) => {
    const eventoEncontrado = props.appointments.find(
      (appointments) => appointments.id === Number(e.event.id)
    );
    if (!eventoEncontrado) {
      e.revert();
      return;
    }
    if (eventoEncontrado.status !== appointmentStatusList.STATUS_PENDIENTE) {
      toaster.create({
        description: "No se puede actualizar una cita que no sea pendiente",
        type: "error",
      });
      e.revert();
      return;
    }
    if (e.event.start) {
      const hoy = new Date();
      const fechaEvento = normalizarFecha(e.event.start);
      if (fechaEvento < hoy) {
        toaster.create({
          description: "La fecha no puede ser inferior a la actual",
          type: "error",
        });
        e.revert();
        return;
      }
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
