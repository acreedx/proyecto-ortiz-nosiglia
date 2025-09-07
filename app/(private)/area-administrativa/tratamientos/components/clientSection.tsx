"use client";
import { Heading, useDialog } from "@chakra-ui/react";
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
import EditXlDialogWithButton from "../../../../../components/admin/dialog/edit-xl-dialog-with-button";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function ClientSection({
  props,
}: {
  props: {
    pacientes: User[];
    treatmentTypes: Treatment[];
  };
}) {
  const createDialog = useDialog();
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  return (
    <>
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>Tratamientos asignados</Heading>
        <EditXlDialogWithButton dialog={createDialog}>
          <TreatmentsCreateForm
            props={{
              pacientes: props.pacientes,
              treatmentTypes: props.treatmentTypes,
              dialog: createDialog,
              gridApiRef: gridApiRef,
              datasourceRef: datasourceRef,
            }}
          />
        </EditXlDialogWithButton>
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
