import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import TreatmentsTable from "./components/treatments-table";
import { prisma } from "../../../../lib/prisma/prisma";
import TreatmentsCreateForm from "./components/treatments-create-form";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import CreateExtraLargeDialog from "../../../../components/admin/dialog/create-xl-dialog";

export default async function Page() {
  const carePlans = await prisma.carePlan.findMany({
    include: {
      patient: {
        include: {
          user: true,
        },
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
  const treatmentTypes = await prisma.treatment.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Tratamientos asignados" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Tratamientos asignados</Heading>
          <CreateExtraLargeDialog>
            <TreatmentsCreateForm
              props={{ pacientes: pacientes, treatmentTypes: treatmentTypes }}
            />
          </CreateExtraLargeDialog>
        </div>
        <TreatmentsTable
          props={{
            careplans: carePlans,
            treatments: treatmentTypes,
          }}
        />
      </main>
    </CanStaff>
  );
}
