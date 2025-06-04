import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import { auth } from "../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import AppointmentsCalendar from "./components/appointments-calendar";
import AppointmentAccordion from "../../../(public)/citas/components/appointments-accordion";
import {
  appointmentStatusList,
  userStatusList,
} from "../../../../types/statusList";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
export interface MockAppointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: string;
}
export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");

  const MockAppointments: MockAppointment[] = [
    {
      id: "1",
      patientName: "Juan Pérez",
      date: "2025-06-05",
      time: "10:00",
      reason: "Control dental",
      status: appointmentStatusList.STATUS_CANCELADA,
    },
    {
      id: "2",
      patientName: "María Gómez",
      date: "2025-06-06",
      time: "11:30",
      reason: "Dolor de muela",
      status: appointmentStatusList.STATUS_COMPLETADA,
    },
    {
      id: "3",
      patientName: "Luis Ortega",
      date: "2025-06-07",
      time: "09:00",
      reason: "Extracción",
      status: appointmentStatusList.STATUS_CONFIRMADA,
    },
    {
      id: "4",
      patientName: "Luis Ortega",
      date: "2025-06-07",
      time: "09:00",
      reason: "Extracción",
      status: appointmentStatusList.STATUS_NO_ASISTIDA,
    },
    {
      id: "5",
      patientName: "Luis Ortega",
      date: "2025-06-07",
      time: "09:00",
      reason: "Extracción",
      status: appointmentStatusList.STATUS_PENDIENTE,
    },
  ];
  const pacientes = await prisma.user.findMany({
    where: {
      status: userStatusList.ACTIVO,
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
  });
  const appointments = await prisma.appointment.findMany({});
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb
        pageName={`Citas del dentista ${session.user.first_name} ${session.user.last_name}`}
      />
      <Heading>
        Citas del dentista {session.user.first_name} {session.user.last_name}
      </Heading>
      <div className="flex flex-row w-full pt-4 gap-4 h-full">
        <div className="w-1/4 p-4">
          <Heading>Listado de citas</Heading>
          <AppointmentAccordion MockAppointments={MockAppointments} />
        </div>
        <AppointmentsCalendar
          MockAppointments={MockAppointments}
          patients={pacientes}
        />
      </div>
    </main>
  );
}
