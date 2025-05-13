"use client";
import type { ColDef } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { AuditEvents } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SystemEventsTable({
  props,
}: {
  props: { eventos: AuditEvents[] };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID" },
    { field: "type", headerName: "Tipo", filter: true },
    { field: "action", headerName: "Acción", filter: true },
    { field: "severity", headerName: "Severidad", filter: true },
    {
      field: "outcome",
      headerName: "Resultado",
      filter: true,
      valueFormatter: (params) => params.value ?? "N/A",
    },
    { field: "module", headerName: "Módulo", filter: true },
    { field: "detail", headerName: "Detalle", filter: true },
    {
      field: "occurred_date_time",
      headerName: "Fecha y Hora",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "",
    },
    { field: "network", headerName: "Red", filter: true },
    { field: "person_name", headerName: "Nombre Persona", filter: true },
    { field: "person_role", headerName: "Rol", filter: true },
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
              aria-label="Ver Detalles"
              //onClick={() => handleViewDetails(params.data)}
            >
              <FaEye color="blue" />
            </IconButton>
          </div>
        );
      },
    },
  ]);
  useEffect(() => {
    setRowData([...props.eventos]);
  }, [props.eventos]);
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
