"use client";
import React, { useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DebtsTable() {
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID" },
    {
      field: "balance",
      headerName: "Saldo",
      valueFormatter: (params) =>
        params.value
          ? `Bs. ${parseFloat(params.value).toFixed(2)}`
          : "Bs. 0.00",
    },
    {
      field: "billing_status",
      headerName: "Estado de Facturación",
      filter: true,
    },
    {
      field: "calculated_at",
      headerName: "Fecha de Cálculo",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "—",
    },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case "A":
            return "Activo";
          case "I":
            return "Inactivo";
          case "B":
            return "Bloqueado";
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
              //onClick={() => handleEdit(params.data)}
            >
              <FaEdit color="orange" />
            </IconButton>
            {params.data.status === "A" && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Desactivar"
                ml={2}
                //onClick={() => handleDeactivate(params.data)}
              >
                <FaTrash color="red" />
              </IconButton>
            )}
            {params.data.status === "I" && (
              <IconButton
                size="sm"
                colorPalette="green"
                variant="outline"
                aria-label="Reactivar"
                ml={2}
                //onClick={() => handleReactivate(params.data)}
              >
                <FaUndo color="green" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ]);
  return <div></div>;
}
