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
    dialog.open("Create Dialog", {
      content: <ImagingStudiesCreateForm props={{ patientId: patientId }} />,
      size: "xl",
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}
