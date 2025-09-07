import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { prisma } from "../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import ClientSection from "./components/clientSection";

export default async function Page() {
  const pacientes = await prisma.user.findMany({
    where: {
      status: {
        in: [userStatusList.ACTIVO, userStatusList.NUEVO],
      },
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
    orderBy: {
      last_name: "asc",
    },
  });
  const treatmentTypes = await prisma.treatment.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Tratamientos asignados" />
        <ClientSection
          props={{ pacientes: pacientes, treatmentTypes: treatmentTypes }}
        />
      </main>
    </CanStaff>
  );
}
