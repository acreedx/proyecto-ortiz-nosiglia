import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CreateUsersReportForm from "../components/create-users-report-form";
import CreateRolesReportForm from "../components/create-roles-report-form";

export default function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Reportes de usuarios" />
        <Heading size="lg" mb={4}>
          Reportes
        </Heading>
        <div className="flex justify-center flex-col px-10">
          <CreateUsersReportForm />
          <CreateRolesReportForm />
        </div>
      </main>
    </CanStaff>
  );
}
