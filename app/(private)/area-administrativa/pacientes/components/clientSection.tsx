"use client";
import { Heading, useDialog } from "@chakra-ui/react";
import React, { useRef } from "react";
import PatientCreateForm from "./patient-create-form";
import PatientTable from "./patient-table";
import { Organization } from "@prisma/client";
import { GridApi, IDatasource } from "ag-grid-community";
import { dialog } from "../../../../../providers/DialogProvider";
import CreateButton from "../../../../../components/common/create-button";

export default function ClientSection({
  props,
}: {
  props: { organizations: Organization[]; activeOrganizations: Organization[] };
}) {
  const createDialog = useDialog();
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  const handleShowCreate = () => {
    dialog.open("Create Dialog", {
      content: (
        <PatientCreateForm
          props={{
            organizations: props.activeOrganizations,
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
      <div className="flex flex-row w-full items-center justify-between mb-2">
        <Heading>Pacientes</Heading>
        <CreateButton handleShowCreate={handleShowCreate} />
      </div>
      <PatientTable
        props={{
          organizations: props.organizations,
          gridApiRef: gridApiRef,
          datasourceRef: datasourceRef,
        }}
      />
    </>
  );
}
