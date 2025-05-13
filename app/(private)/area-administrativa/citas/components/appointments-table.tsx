"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEye, FaEdit, FaBan } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { Appointment } from "@prisma/client";
import { userStatusList } from "../../../../../types/statusList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AppointmentsTable({
  props,
}: {
  props: {
    citas: Appointment[];
  };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID" },
    {
      field: "scheduled_on",
      headerName: "Fecha de Registro",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "",
    },
    {
      field: "programed_date_time",
      headerName: "Fecha Programada",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "",
    },
    { field: "specialty", headerName: "Especialidad", filter: true },
    { field: "reason", headerName: "Motivo", filter: true },
    {
      field: "note",
      headerName: "Nota",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "patient_instruction",
      headerName: "Instrucciones",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "cancellation_date",
      headerName: "Fecha de Cancelación",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "—",
    },
    {
      field: "cancellation_reason",
      headerName: "Motivo Cancelación",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "is_cancelled",
      headerName: "Cancelado",
      valueFormatter: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "status",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.BLOQUEADO:
            return "Cancelado";
          case userStatusList.INACTIVO:
            return "Finalizado";
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
              colorPalette="blue"
              variant="outline"
              aria-label="Ver Detalles"
              //onClick={() => handleViewDetails(params.data)}
            >
              <FaEye color="blue" />
            </IconButton>
            {!params.data.is_cancelled && (
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                ml={2}
                //onClick={() => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
            )}
            {!params.data.is_cancelled && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Cancelar"
                ml={2}
                //onClick={() => handleCancel(params.data)}
              >
                <FaBan color="red" />
              </IconButton>
            )}
          </div>
        );
      },
    },
  ]);
  useEffect(() => {
    setRowData([...props.citas]);
  }, [props.citas]);
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
