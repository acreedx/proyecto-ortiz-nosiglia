import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import { auth } from "../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import { userStatusList } from "../../../../types/statusList";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import AppointmentsSection from "./sections/appointments-section";
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
  const pacientes = await prisma.user.findMany({
    where: {
      status: userStatusList.ACTIVO,
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
  });
  const usuario = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
    include: {
      staff: {
        include: {
          doctor: true,
        },
      },
    },
  });
  if (!usuario || !usuario.staff || !usuario.staff.doctor) {
    return <div>No encontrado</div>;
  }
  const appointments = await prisma.appointment.findMany({
    where: {
      doctor_id: usuario.staff.doctor.id,
    },
    orderBy: {
      programed_date_time: "desc",
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          staff: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb
        pageName={`Citas del dentista ${session.user.first_name} ${session.user.last_name}`}
      />
      <Heading>
        Citas del dentista {session.user.first_name} {session.user.last_name}
      </Heading>
      <AppointmentsSection
        props={{
          appointments: appointments,
          patients: pacientes,
        }}
      />
    </main>
  );
}
