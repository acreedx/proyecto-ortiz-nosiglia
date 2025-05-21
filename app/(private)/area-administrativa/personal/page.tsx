import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import StaffTable from "./components/staff-table";

export default async function Page() {
  const personal = await prisma.user.findMany({
    where: {
      role: {
        NOT: [
          {
            role_name: rolesList.PACIENTE,
          },
        ],
      },
    },
    include: {
      staff: {
        include: {
          payroll: true,
        },
      },
      role: true,
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Personal" />
        <Heading>Personal</Heading>
        <StaffTable
          props={{
            personal: personal,
          }}
        />
      </main>
    </CanStaff>
  );
}
