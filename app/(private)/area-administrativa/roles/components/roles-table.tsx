"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Role } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function RolesTable({
  props,
}: {
  props: {
    roles: Role[];
  };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "role_name", headerName: "Nombre del Rol", filter: true },
    { field: "description", headerName: "Descripción", filter: true },
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
      cellRenderer: (params: any) => (
        <div className="flex flex-row items-center justify-center w-full">
          {params.data.role_name !== rolesList.ADMINISTRADOR && (
            <>
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                onClick={async () => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
              {params.data.status === userStatusList.ACTIVO && (
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Deshabilitar"
                  ml={2}
                  onClick={async () => handleDelete(params.data)}
                >
                  <FaTrash color="red" />
                </IconButton>
              )}
              {params.data.status === userStatusList.INACTIVO && (
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Rehabilitar"
                  ml={2}
                  onClick={async () => handleRestore(params.data)}
                >
                  <FaTrash color="red" />
                </IconButton>
              )}
            </>
          )}
        </div>
      ),
    },
  ]);
  const handleEdit = async (e: Role) => {
    console.log(e);
  };
  const handleDelete = async (e: Role) => {
    console.log(e);
  };
  const handleRestore = async (e: Role) => {
    console.log(e);
  };
  useEffect(() => {
    setRowData([...props.roles]);
  }, [props.roles]);
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
