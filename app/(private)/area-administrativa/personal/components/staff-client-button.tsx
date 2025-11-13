"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";
import QualificationsCreateForm from "./qualification-create-form";

export default function StaffClientButton({
  doctor_id,
}: {
  doctor_id: number;
}) {
  const handleShowCreate = () => {
    dialog.open("Edit Dialog", {
      content: <QualificationsCreateForm doctor_id={doctor_id} />,
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
