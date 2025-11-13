"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";
import OrganizationsCreateForm from "./organizations-create-form";

export default function OrganizationClientButton() {
  const handleShowCreate = () => {
    dialog.open("Edit Dialog", {
      content: <OrganizationsCreateForm />,
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
