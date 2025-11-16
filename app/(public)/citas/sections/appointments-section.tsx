"use client";
import { useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import { Prisma, User } from "@prisma/client";
import AppointmentAccordion from "../components/appointments-accordion";
import AppointmentsCalendar from "../components/appointments-calendar";

export default function AppointmentsSection({
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
    doctors: User[];
  };
}) {
  const [Events, setEvents] = useState<
    Prisma.AppointmentGetPayload<{
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
  >([]);
  useEffect(() => {
    setEvents(props.appointments);
  }, [props.appointments]);
  return (
    <div className="flex flex-col w-full pt-4 gap-4 h-full md:flex-row">
      <div className="w-full h-auto px-4 md:w-1/4 ">
        <Heading>Listado de citas</Heading>
        <AppointmentAccordion
          props={{
            appointments: props.appointments,
          }}
        />
      </div>
      <div className="w-full h-auto md:w-3/4">
        <AppointmentsCalendar
          props={{
            appointments: Events,
            doctores: props.doctors,
          }}
        />
      </div>
    </div>
  );
}
