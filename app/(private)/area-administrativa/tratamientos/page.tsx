import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import TreatmentsTable from "./components/treatments-table";
import { prisma } from "../../../../lib/prisma/prisma";
import TreatmentsCreateForm from "./components/treatments-create-form";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";

export default async function Page() {
  const carePlans = await prisma.carePlan.findMany({});
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
        <BreadCrumb pageName="Tratamientos" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Tratamientos</Heading>
          <CreateDialog>
            <TreatmentsCreateForm props={{ pacientes: pacientes }} />
          </CreateDialog>
        </div>
        <TreatmentsTable
          props={{
            careplans: carePlans,
          }}
        />
      </main>
    </CanStaff>
  );
}
