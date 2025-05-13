"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { CarePlan } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TreatmentsTable({
  props,
}: {
  props: {
    careplans: CarePlan[];
  };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID" },
    {
      field: "treatment_type",
      headerName: "Tipo de Tratamiento",
      filter: true,
    },
    {
      field: "title",
      headerName: "Título",
      filter: true,
    },
    {
      field: "description",
      headerName: "Descripción",
      filter: true,
    },
    {
      field: "start_date",
      headerName: "Fecha de Inicio",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "—",
    },
    {
      field: "end_date",
      headerName: "Fecha de Fin",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "—",
    },
    {
      field: "estimated_appointments",
      headerName: "Citas Estimadas",
    },
    {
      field: "days_between_appointments",
      headerName: "Días entre Citas",
    },
    {
      field: "total_appointments",
      headerName: "Total de Citas",
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "cost",
      headerName: "Costo",
      valueFormatter: (params) =>
        params.value
          ? `Bs. ${parseFloat(params.value).toFixed(2)}`
          : "Bs. 0.00",
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
          case "C":
            return "Completado";
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
                aria-label="Desactivar"
                ml={2}
                onClick={() => handleDeactivate(params.data)}
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
                onClick={() => handleReactivate(params.data)}
              >
                <FaUndo color="green" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ]);
  useEffect(() => {
    setRowData([...props.careplans]);
  }, [props.careplans]);
  return (
    <div className="w-full h-full mb-4 pt-4">
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        colResizeDefault="shift"
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={{
          flex: 1,
          resizable: false,
          sortable: true,
          filter: false,
          filterParams: {
            filterOptions: ["contains", "equals"],
            maxNumConditions: 1,
          },
          wrapText: true,
          autoHeight: true,
        }}
        suppressCellFocus
        cellSelection={false}
        autoSizeStrategy={{
          type: "fitGridWidth",
        }}
      />
    </div>
  );
}
