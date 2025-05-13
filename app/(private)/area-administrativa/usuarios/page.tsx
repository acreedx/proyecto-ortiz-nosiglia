import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import UsersTable from "./components/users-table";
import { prisma } from "../../../../lib/prisma/prisma";

export default async function Page() {
  const usuarios = await prisma.user.findMany({
    include: {
      role: true,
    },
  });
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Usuarios" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Usuarios</Heading>
          <CreateDialog>
            <div>Create</div>
          </CreateDialog>
        </div>
        <UsersTable props={{ usuarios: usuarios }} />
      </main>
    </CanStaff>
  );
}
