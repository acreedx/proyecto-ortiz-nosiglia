import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import DebtsTable from "./components/debts-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { userStatusList } from "../../../../types/statusList";

export default async function Page() {
  const accounts = await prisma.account.findMany({
    where: {
      patient: {
        user: {
          status: userStatusList.ACTIVO,
          role: {
            role_name: rolesList.PACIENTE,
          },
        },
      },
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Deudas" />
        <Heading>Panel de deudas</Heading>
        <DebtsTable props={{ accounts: accounts }} />
      </main>
    </CanStaff>
  );
}
