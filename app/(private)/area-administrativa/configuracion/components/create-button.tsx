"use client";
import React from "react";
import { createDefaultConfiguration } from "../actions/operations";
import {
  mostrarAlertaError,
  mostrarAlertaExito,
} from "../../../../../lib/sweetalert/alerts";
import { Button } from "@chakra-ui/react";

export default function CreateButton() {
  const handleCreate = async () => {
    const res = await createDefaultConfiguration();

    if (res.ok) {
      mostrarAlertaExito({
        mensaje: "Creada configuración por defecto",
      });
    } else {
      mostrarAlertaError({
        mensaje: "Error al crear la configuración",
      });
    }
  };
  return (
    <Button colorPalette={"orange"} onClick={handleCreate}>
      crear
    </Button>
  );
}
