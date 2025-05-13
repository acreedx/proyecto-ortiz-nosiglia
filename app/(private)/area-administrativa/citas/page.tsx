import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import AppointmentsTable from "./components/appointments-table";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Citas" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Citas</Heading>
          <CreateDialog>Create</CreateDialog>
        </div>
        <AppointmentsTable />
      </main>
    </CanStaff>
  );
}
