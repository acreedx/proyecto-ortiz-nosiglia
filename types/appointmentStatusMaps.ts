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
    const start = appt.programed_date_time;
    console.log(start);
    const end = start.getTime() + 30 * 60 * 1000;
    return {
      id: appt.id.toString(),
      title: `${appt.patient.user.first_name} ${appt.patient.user.last_name}`,
      start,
      end,
      allDay: false,
      color: appt.status ? statusColorMap[appt.status] : "gray",
    };
  });
}
