"use client";
import React from "react";
import CreateButton from "../../../../../components/common/create-button";
import { dialog } from "../../../../../providers/DialogProvider";
import QualificationsCreateForm from "./qualifications-create-form";

type Props = {
  doctor_id: number;
};

function QualificationsClient({ doctor_id }: Props) {
  const handleShowCreate = () => {
    dialog.open("Create Dialog", {
      content: <QualificationsCreateForm doctor_id={doctor_id} />,
    });
  };
  return <CreateButton handleShowCreate={handleShowCreate} />;
}

export default QualificationsClient;
