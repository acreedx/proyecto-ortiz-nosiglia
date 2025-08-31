import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import SystemEventsTable from "./components/system-events-table";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Eventos del sistema" />
        <Heading>Eventos del sistema</Heading>
        <SystemEventsTable />
      </main>
    </CanStaff>
  );
}
