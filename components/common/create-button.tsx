"use client";
import { Button } from "@chakra-ui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";

type Props = {
  handleShowCreate: () => void;
};

function CreateButton({ handleShowCreate }: Props) {
  return (
    <Button variant="outline" size="sm" onClick={handleShowCreate}>
      <LuPlus color="orange" /> Crear
    </Button>
  );
}

export default CreateButton;
