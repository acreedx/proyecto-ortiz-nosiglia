"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Prisma, User } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { IconButton, Image } from "@chakra-ui/react";
import { FaEdit, FaMoneyBill, FaTrash } from "react-icons/fa";
import { userStatusList } from "../../../../../types/statusList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function StaffTable({
  props,
}: {
  props: {
    personal: Prisma.UserGetPayload<{
      include: {
        staff: true;
      };
    }>[];
  };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    { field: "id", headerName: "ID", flex: 0.5 },
    {
      field: "photo_url",
      headerName: "Foto",
      cellRenderer: (params: any) => (
        <Image
          src={params.value}
          alt="Foto"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      ),
    },
    { field: "identification", headerName: "Carnet", filter: true },
    {
      field: "first_name",
      headerName: "Nombre completo",
      filter: true,
      valueFormatter: (params) => {
        return `${params.value} ${params.data.last_name}`;
      },
    },
    { field: "phone", headerName: "Teléfono" },
    { field: "mobile", headerName: "Celular" },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Inactivo";
          case userStatusList.BLOQUEADO:
            return "Bloqueado";
          case userStatusList.NUEVO:
            return "Nuevo";
          default:
            return "—";
        }
      },
    },
    {
      field: "staff.contratation_date",
      headerName: "Fecha de contratación",
      valueFormatter: (params) => params.value.toLocaleDateString(),
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (params: any) => (
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
          <IconButton
            size="sm"
            colorPalette="red"
            variant="outline"
            aria-label="Pagos"
            ml={2}
            //onClick={() => handleDelete(params.data)}
          >
            <FaMoneyBill color="green" />
          </IconButton>
        </div>
      ),
    },
  ]);
  useEffect(() => {
    setRowData([...props.personal]);
  }, [props.personal]);
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
