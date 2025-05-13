import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { prisma } from "../../../../lib/prisma/prisma";
import { Heading } from "@chakra-ui/react";
import SystemEventsTable from "./components/system-events-table";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  const eventos = await prisma.auditEvents.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Eventos del sistema" />
        <Heading>Eventos del sistema</Heading>
        <SystemEventsTable props={{ eventos: eventos }} />
      </main>
    </CanStaff>
  );
}
