import React from "react";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import { prisma } from "../../../../../lib/prisma/prisma";
import { auth } from "../../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import { rolesList } from "../../../../../lib/nextauth/rolesList";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === rolesList.PACIENTE)
    redirect("acceso-no-autorizado");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
  });
  if (!user) redirect("/login");
  return (
    <main>
      <BreadCrumb pageName="Títulos" />
      <Heading>Editar tus títulos</Heading>
    </main>
  );
}
