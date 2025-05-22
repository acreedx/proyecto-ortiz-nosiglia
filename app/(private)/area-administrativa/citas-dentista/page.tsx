import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { auth } from "../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  if (
    session.user.role !== rolesList.DENTISTA &&
    session.user.role !== rolesList.MEDICO_TEMPORAL
  )
    redirect("/acceso-no-autorizado");
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb pageName="Citas del dentista" />
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>
          Citas del dentista {session.user.first_name} {session.user.last_name}
        </Heading>
        <CreateDialog>
          <div>Crear citas para el paciente</div>
        </CreateDialog>
      </div>
      {/* Agregar el calendario para las citas del dentista*/}
    </main>
  );
}
