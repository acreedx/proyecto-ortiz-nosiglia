import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import AppointmentsTable from "./components/appointments-table";
import CanStaff from "../../../../lib/rbac/can-staff";
import { prisma } from "../../../../lib/prisma/prisma";
import AppointmentsCreateForm from "./components/appointments-create-form";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import CreateExtraLargeDialog from "../../../../components/admin/dialog/create-xl-dialog";

export default async function Page() {
  const appointments = await prisma.appointment.findMany({
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
  const doctores = await prisma.user.findMany({
    where: {
      status: userStatusList.ACTIVO,
      role: {
        role_name: rolesList.DENTISTA,
      },
    },
  });
  const pacientes = await prisma.user.findMany({
    where: {
      status: userStatusList.ACTIVO,
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Citas" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Citas</Heading>
          <CreateExtraLargeDialog>
            <AppointmentsCreateForm
              props={{
                doctores: doctores,
                pacientes: pacientes,
              }}
            />
          </CreateExtraLargeDialog>
        </div>
        <AppointmentsTable
          props={{
            citas: appointments,
            doctores: doctores,
          }}
        />
      </main>
    </CanStaff>
  );
}
