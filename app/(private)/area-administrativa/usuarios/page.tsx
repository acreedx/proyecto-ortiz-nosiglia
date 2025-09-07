import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { prisma } from "../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../types/statusList";
import { auth } from "../../../../lib/nextauth/auth";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { redirect } from "next/navigation";
import ClientSection from "./components/clientSection";

export default async function Page() {
  const roles = await prisma.role.findMany({
    where: {
      status: userStatusList.ACTIVO,
      role_name: {
        not: rolesList.ADMINISTRADOR,
      },
    },
  });
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === rolesList.PACIENTE)
    redirect("/acceso-no-autorizado");
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb pageName="Usuarios" />
      <ClientSection props={{ roles: roles, session: session }} />
    </main>
  );
}
