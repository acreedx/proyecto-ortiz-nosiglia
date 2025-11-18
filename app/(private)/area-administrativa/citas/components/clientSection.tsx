"use client";
import { Heading, useDialog } from "@chakra-ui/react";
import { GridApi, IDatasource } from "ag-grid-community";
import React, { useRef } from "react";
import AppointmentsCreateForm from "./appointments-create-form";
import AppointmentsTable from "./appointments-table";
import { User } from "@prisma/client";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";

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
  const handleShowCreate = () => {
    dialog.open("Create Dialog", {
      content: (
        <AppointmentsCreateForm
          props={{
            doctores: props.doctores,
            pacientes: props.pacientes,
            dialog: createDialog,
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
        <Heading>Citas</Heading>
        <CreateButton handleShowCreate={handleShowCreate} />
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
