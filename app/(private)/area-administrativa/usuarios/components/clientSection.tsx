"use client";
import { Heading, useDialog } from "@chakra-ui/react";
import { Role } from "@prisma/client";
import { GridApi, IDatasource } from "ag-grid-community";
import { Session } from "next-auth";
import React, { useRef } from "react";
import UsersCreateForm from "./users-create-form";
import UsersTable from "./users-table";
import EditXlDialogWithButton from "../../../../../components/admin/dialog/edit-xl-dialog-with-button";

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
  return (
    <>
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>Usuarios</Heading>
        <EditXlDialogWithButton dialog={createDialog}>
          <UsersCreateForm
            props={{
              roles: props.roles,
              dialog: createDialog,
              gridApiRef: gridApiRef,
              datasourceRef: datasourceRef,
            }}
          />
        </EditXlDialogWithButton>
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
