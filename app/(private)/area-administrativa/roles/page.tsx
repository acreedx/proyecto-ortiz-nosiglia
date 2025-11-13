import React from "react";
import { prisma } from "../../../../lib/prisma/prisma";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import RolesTable from "./components/roles-table";
import CanStaff from "../../../../lib/rbac/can-staff";
import { userStatusList } from "../../../../types/statusList";
import RolesClientButton from "./components/roles-client-button";

export default async function Page() {
  const roles = await prisma.role.findMany({
    include: {
      role_permissions: {
        include: {
          permission: true,
        },
      },
    },
  });
  const permissions = await prisma.permission.findMany({
    where: {
      status: userStatusList.ACTIVO,
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Roles" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Roles</Heading>
          <RolesClientButton permissions={permissions} />
        </div>
        <RolesTable
          props={{
            roles: roles,
            permissions: permissions,
          }}
        />
      </main>
    </CanStaff>
  );
}
