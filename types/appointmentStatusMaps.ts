import { Prisma } from "@prisma/client";
import { appointmentStatusList } from "./statusList";
import { EventInput } from "@fullcalendar/core/index.js";

export const statusColorMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "red",
  [appointmentStatusList.STATUS_COMPLETADA]: "green",
  [appointmentStatusList.STATUS_CONFIRMADA]: "blue",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "gray",
  [appointmentStatusList.STATUS_PENDIENTE]: "yellow",
};
export const statusLabelMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "Cancelada",
  [appointmentStatusList.STATUS_COMPLETADA]: "Completada",
  [appointmentStatusList.STATUS_CONFIRMADA]: "Confirmada",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "No Asistida",
  [appointmentStatusList.STATUS_PENDIENTE]: "Pendiente",
};

function normalizarFecha(fecha: Date) {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    fecha.getUTCHours(),
    fecha.getUTCMinutes()
  );
}
export function convertirAppointmentsAEventos(
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
  }>[]
): EventInput[] {
  return appointments.map((appt) => {
    const start: Date = normalizarFecha(appt.programed_date_time);
    const end = normalizarFecha(appt.programed_end_date_time);
    return {
      id: appt.id.toString(),
      title: `${appt.patient.user.first_name} ${appt.patient.user.last_name}`,
      start: start,
      end: end,
      allDay: false,
      color: appt.status ? statusColorMap[appt.status] : "gray",
    };
  });
}
