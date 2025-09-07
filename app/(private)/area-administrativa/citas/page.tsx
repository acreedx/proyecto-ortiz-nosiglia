import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { prisma } from "../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import ClientSection from "./components/clientSection";

export default async function Page() {
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
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Citas" />
        <ClientSection
          props={{
            doctores: doctores,
            pacientes: pacientes,
          }}
        />
      </main>
    </CanStaff>
  );
}
