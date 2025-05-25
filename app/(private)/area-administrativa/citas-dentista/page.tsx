import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import { auth } from "../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import AppointmentsCalendar from "./components/appointments-calendar";
import AppointmentAccordion from "../../../(public)/citas/components/appointments-accordion";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb
        pageName={`Citas del dentista ${session.user.first_name} ${session.user.last_name}`}
      />
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>
          Citas del dentista {session.user.first_name} {session.user.last_name}
        </Heading>
        <CreateDialog>
          <div>Crear citas para el paciente</div>
        </CreateDialog>
      </div>
      <div className="flex flex-row w-full pt-4 gap-4">
        <div className="w-1/2 p-4">
          <Heading>Listado de citas</Heading>
          <AppointmentAccordion />
        </div>
        <AppointmentsCalendar />
      </div>
    </main>
  );
}
