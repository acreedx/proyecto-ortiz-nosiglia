"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TreatmentTypeTable({
  props,
}: {
  props: {
    treatments: any[];
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
      field: "estimated_appointments",
      headerName: "Citas Estimadas",
      type: "numberColumn",
    },
    {
      field: "days_between_appointments",
      headerName: "Días entre Citas",
      type: "numberColumn",
    },
    {
      field: "cost_estimation",
      headerName: "Costo Estimado",
      valueFormatter: (params) =>
        params.value ? `${parseFloat(params.value).toFixed(2)} bs` : "—",
    },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Inactivo";
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
            <IconButton
              size="sm"
              colorPalette="red"
              variant="outline"
              aria-label="Eliminar"
              ml={2}
              //onClick={() => handleDelete(params.data)}
            >
              <FaTrash color="red" />
            </IconButton>
          </div>
        );
      },
    },
  ]);

  useEffect(() => {
    setRowData([...props.treatments]);
  }, [props.treatments]);
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
