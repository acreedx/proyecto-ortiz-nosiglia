import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import UsersTable from "./components/users-table";
import { prisma } from "../../../../lib/prisma/prisma";
import UsersCreateForm from "./components/users-create-form";
import CreateLargeDialog from "../../../../components/admin/dialog/create-large-dialog";
import { userStatusList } from "../../../../types/statusList";

export default async function Page() {
  const usuarios = await prisma.user.findMany({
    include: {
      role: true,
    },
  });
  const roles = await prisma.role.findMany({
    where: {
      status: userStatusList.ACTIVO,
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Usuarios" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Usuarios</Heading>
          <CreateLargeDialog>
            <UsersCreateForm
              props={{
                roles: roles,
              }}
            />
          </CreateLargeDialog>
        </div>
        <UsersTable props={{ usuarios: usuarios, roles: roles }} />
      </main>
    </CanStaff>
  );
}
