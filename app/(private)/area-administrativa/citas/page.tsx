import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import AppointmentsTable from "./components/appointments-table";
import CanStaff from "../../../../lib/rbac/can-staff";
import { prisma } from "../../../../lib/prisma/prisma";
import AppointmentsCreateForm from "./components/appointments-create-form";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";

export default async function Page() {
  const appointments = await prisma.appointment.findMany();
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
          <CreateDialog>
            <AppointmentsCreateForm
              props={{
                doctores: doctores,
                pacientes: pacientes,
              }}
            />
          </CreateDialog>
        </div>
        <AppointmentsTable
          props={{
            citas: appointments,
          }}
        />
      </main>
    </CanStaff>
  );
}
