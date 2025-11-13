"use client";
import { Heading } from "@chakra-ui/react";
import { Treatment, User } from "@prisma/client";
import React, { useRef } from "react";
import TreatmentsCreateForm from "./treatments-create-form";
import TreatmentsTable from "./treatments-table";
import {
  AllCommunityModule,
  GridApi,
  IDatasource,
  ModuleRegistry,
} from "ag-grid-community";
import { dialog } from "../../../../../providers/DialogProvider";
import CreateButton from "../../../../../components/common/create-button";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ClientSection({
  props,
}: {
  props: {
    pacientes: User[];
    treatmentTypes: Treatment[];
  };
}) {
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  const handleShowCreate = () => {
    dialog.open("Create Dialog", {
      content: (
        <TreatmentsCreateForm
          props={{
            pacientes: props.pacientes,
            treatmentTypes: props.treatmentTypes,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      ),
      size: "xl",
    });
  };
  return (
    <>
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>Tratamientos asignados</Heading>
        <CreateButton handleShowCreate={handleShowCreate} />
      </div>
      <TreatmentsTable
        props={{
          gridApiRef: gridApiRef,
          datasourceRef: datasourceRef,
        }}
      />
    </>
  );
}
