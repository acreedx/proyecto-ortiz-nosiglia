import { Prisma } from "@prisma/client";
import { EventInput } from "@fullcalendar/core/index.js";
import { getUserColor, normalizarFecha } from "../hooks/utils";
import { statusColorMap } from "./consts";

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
    const color = getUserColor(appt.doctor.staff.user);
    return {
      id: appt.id.toString(),
      title: `${appt.patient.user.first_name} ${appt.patient.user.last_name}`,
      start: start,
      end: end,
      allDay: false,
      textColor: "white",
      backgroundColor: color,
      color: appt.status ? statusColorMap[appt.status] : "gray",
    };
  });
}
