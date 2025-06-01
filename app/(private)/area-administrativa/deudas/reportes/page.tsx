import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CreateAccountsReportForm from "../components/create-accounts-report-form";

export default function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Reportes de deudas" />
        <Heading size="lg" mb={4}>
          Reportes
        </Heading>
        <div className="flex justify-center flex-col px-10">
          <CreateAccountsReportForm />
        </div>
      </main>
    </CanStaff>
  );
}
