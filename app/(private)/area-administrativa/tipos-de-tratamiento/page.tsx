import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import TreatmentTypeTable from "./components/treatment-type-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import TreatmentClientButton from "./components/treatment-client-button";

export default async function Page() {
  const treatments = await prisma.treatment.findMany({});

  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Tipos de tratamiento" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Tipos de tratamiento</Heading>
          <TreatmentClientButton />
        </div>
        <TreatmentTypeTable
          props={{
            treatments: treatments,
          }}
        />
      </main>
    </CanStaff>
  );
}
