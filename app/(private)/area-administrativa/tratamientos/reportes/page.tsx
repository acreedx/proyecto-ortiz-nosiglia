import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CreateTreatmentsReportForm from "../components/create-treatments-report-form";
import CreateTreatmentTypeReportForm from "../components/create-treatment-type-report-form copy";

export default function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Reportes de tratamientos" />
        <Heading size="lg" mb={4}>
          Reportes
        </Heading>
        <div className="flex justify-center flex-col px-10">
          <CreateTreatmentTypeReportForm />
          <CreateTreatmentsReportForm />
        </div>
      </main>
    </CanStaff>
  );
}
