"use client";
import { IconButton } from "@chakra-ui/react";
import React, { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

export default function EncountersTable() {
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID" },
    {
      field: "type",
      headerName: "Tipo",
      filter: true,
    },
    {
      field: "performed_on",
      headerName: "Fecha de Atención",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "—",
    },
    {
      field: "specialty",
      headerName: "Especialidad",
      filter: true,
    },
    {
      field: "reason",
      headerName: "Motivo",
      filter: true,
    },
    {
      field: "note",
      headerName: "Nota",
      filter: true,
    },
    {
      field: "patient_instruction",
      headerName: "Instrucciones para el Paciente",
      filter: true,
    },
    {
      field: "diagnosis",
      headerName: "Diagnóstico",
      filter: true,
    },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case "A":
            return "Activo";
          case "F":
            return "Finalizado";
          case "C":
            return "Cancelado";
          default:
            return "—";
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full">
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Editar"
              onClick={() => handleEdit(params.data)}
            >
              <FaEdit color="orange" />
            </IconButton>
            {params.data.status === "A" && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Cancelar"
                ml={2}
                onClick={() => handleCancel(params.data)}
              >
                <FaTrash color="red" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ]);
  return <div></div>;
}
