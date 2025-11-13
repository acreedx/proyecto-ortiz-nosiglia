"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";
import TreatmentTypeCreateForm from "./treatment-type-create-form";

export default function TreatmentClientButton() {
  const handleShowCreate = () => {
    dialog.open("Treatments Dialog", {
      content: <TreatmentTypeCreateForm />,
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
