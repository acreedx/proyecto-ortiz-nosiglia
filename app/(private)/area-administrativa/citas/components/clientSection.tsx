"use client";
import { Heading, useDialog } from "@chakra-ui/react";
import { GridApi, IDatasource } from "ag-grid-community";
import React, { useRef } from "react";
import AppointmentsCreateForm from "./appointments-create-form";
import AppointmentsTable from "./appointments-table";
import { User } from "@prisma/client";
import EditXlDialogWithButton from "../../../../../components/admin/dialog/edit-xl-dialog-with-button";

export default function ClientSection({
  props,
}: {
  props: {
    doctores: User[];
    pacientes: User[];
  };
}) {
  const createDialog = useDialog();
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  return (
    <>
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>Citas</Heading>
        <EditXlDialogWithButton dialog={createDialog}>
          <AppointmentsCreateForm
            props={{
              doctores: props.doctores,
              pacientes: props.pacientes,
              dialog: createDialog,
              gridApiRef: gridApiRef,
              datasourceRef: datasourceRef,
            }}
          />
        </EditXlDialogWithButton>
      </div>
      <AppointmentsTable
        props={{
          doctores: props.doctores,
          gridApiRef: gridApiRef,
          datasourceRef: datasourceRef,
        }}
      />
    </>
  );
}
