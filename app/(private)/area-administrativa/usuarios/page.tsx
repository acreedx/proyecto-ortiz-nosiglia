import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import UsersTable from "./components/users-table";
import { prisma } from "../../../../lib/prisma/prisma";
import UsersCreateForm from "./components/users-create-form";
import CreateLargeDialog from "../../../../components/admin/dialog/create-large-dialog";
import { userStatusList } from "../../../../types/statusList";
import { auth } from "../../../../lib/nextauth/auth";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { redirect } from "next/navigation";

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
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === rolesList.PACIENTE)
    redirect("/acceso-no-autorizado");
  return (
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
      <UsersTable
        props={{ usuarios: usuarios, roles: roles, session: session }}
      />
    </main>
  );
}
