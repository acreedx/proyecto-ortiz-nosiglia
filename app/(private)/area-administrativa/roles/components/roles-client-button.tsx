"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { Permission } from "@prisma/client";
import RolesCreateForm from "./roles-create-form";
import { dialog } from "../../../../../providers/DialogProvider";

export default function RolesClientButton({
  permissions,
}: {
  permissions: Permission[];
}) {
  const handleShowCreate = () => {
    dialog.open("Treatments Dialog", {
      content: (
        <RolesCreateForm
          props={{
            permissions: permissions,
          }}
        />
      ),
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
