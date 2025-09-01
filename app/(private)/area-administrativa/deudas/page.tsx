import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import DebtsTable from "./components/debts-table";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Deudas" />
        <Heading>Panel de deudas</Heading>
        <DebtsTable />
      </main>
    </CanStaff>
  );
}
