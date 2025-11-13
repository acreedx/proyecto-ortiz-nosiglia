"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";
import ImagingStudiesCreateForm from "./imaging-studies-create-form";

export default function PatientClientButton({
  patientId,
}: {
  patientId: number;
}) {
  const handleShowCreate = () => {
    dialog.open("Edit Dialog", {
      content: <ImagingStudiesCreateForm props={{ patientId: patientId }} />,
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
