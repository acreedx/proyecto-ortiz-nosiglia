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
    patients: User[];
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
    <div className="flex flex-row w-full pt-4 gap-4 h-full">
      <div className="flex flex-col xl:flex-row w-full h-auto">
        {/* Listado de citas */}
        <div className="w-full xl:w-1/4 h-auto px-4 mb-4 xl:mb-0 min-h-[700px]">
          <Heading>Listado de citas</Heading>
          <AppointmentAccordion
            props={{
              appointments: props.appointments,
            }}
          />
        </div>

        {/* Calendario */}
        <div className="w-full xl:w-3/4 h-auto">
          <AppointmentsCalendar
            props={{
              appointments: Events,
              patients: props.patients,
            }}
          />
        </div>
      </div>
    </div>
  );
}
