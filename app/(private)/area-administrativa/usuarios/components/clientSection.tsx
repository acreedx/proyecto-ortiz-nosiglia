"use client";
import { Heading, useDialog } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { GridApi, IDatasource } from "ag-grid-community";
import { Session } from "next-auth";
import React, { useRef } from "react";
import UsersCreateForm from "./users-create-form";
import UsersTable from "./users-table";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";

export default function ClientSection({
  props,
}: {
  props: {
    roles: Role[];
    session: Session;
  };
}) {
  const createDialog = useDialog();
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  const handleShowCreate = () => {
    dialog.open("Treatments Dialog", {
      content: (
        <UsersCreateForm
          props={{
            roles: props.roles,
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
      <div className="flex flex-row w-full items-center justify-between mb-4">
        <Heading>Usuarios</Heading>
        <CreateButton handleShowCreate={handleShowCreate} />
      </div>
      <UsersTable
        props={{
          roles: props.roles,
          session: props.session,
          gridApiRef: gridApiRef,
          datasourceRef: datasourceRef,
        }}
      />
    </>
  );
}
