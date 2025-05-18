import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import TreatmentTypeTable from "./components/treatment-type-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import TreatmentTypeCreateForm from "./components/treatment-type-create-form";

export default async function Page() {
  const treatments = await prisma.treatment.findMany({});
  const serializedTreatments = treatments.map((t) => ({
    ...t,
    cost_estimation: t.cost_estimation.toNumber(),
  }));
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Tipos de tratamiento" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Tipos de tratamiento</Heading>
          <CreateDialog>
            <TreatmentTypeCreateForm />
          </CreateDialog>
        </div>
        <TreatmentTypeTable
          props={{
            treatments: serializedTreatments,
          }}
        />
      </main>
    </CanStaff>
  );
}
