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
import {
  mostrarAlertaConfirmacion,
  mostrarAlertaError,
} from "../../../../../lib/sweetalert/alerts";
import { Prisma, User } from "@prisma/client";
import { convertirAppointmentsAEventos } from "../../../../../types/appointmentStatusMaps";
import { updateAppointmentDateTime } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import { appointmentStatusList } from "../../../../../types/statusList";
import { isTodayOrFuture, normalizarFecha } from "../../../../../hooks/utils";
import { dialog } from "../../../../../providers/DialogProvider";
import AppointmentsCreateCalendarForm from "./appointments-create-calendar-form";
import AppointmentsViewForm from "./appointments-view-form";

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
    patients: User[];
  };
}) {
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
  const handleDateSelect = async (e: DateSelectArg) => {
    if (isTodayOrFuture(e.start)) {
      dialog.open("Create Dialog", {
        content: (
          <AppointmentsCreateCalendarForm
            props={{ pacientes: props.patients, selectedDate: e.start }}
          />
        ),
        size: "xl",
      });
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
    if (eventoEncontrado) {
      dialog.open("Edit Dialog", {
        content: (
          <AppointmentsViewForm
            props={{
              selectedAppointment: eventoEncontrado,
            }}
          />
        ),
        size: "xl",
      });
    }
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
      eventDidMount={(info) => {
        const border = info.event.borderColor || "gray";
        const text = info.event.textColor || "white";
        const background = info.event.backgroundColor || "black";
        info.el.style.borderColor = border;
        info.el.style.color = text;
        info.el.style.backgroundColor = background;
      }}
      events={convertirAppointmentsAEventos(props.appointments)}
      eventClick={handleClickEvent}
    />
  );
}
