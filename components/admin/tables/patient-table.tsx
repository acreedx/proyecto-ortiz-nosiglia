"use client";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import Image from "next/image";
import { Heading, IconButton } from "@chakra-ui/react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PatientTable({
  pacientes,
}: {
  pacientes: Prisma.UserGetPayload<{
    include: {
      role: true;
    };
  }>[];
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "photo_url",
      headerName: "Foto",
      width: 100,
      filter: false,
      sortable: false,
      flex: 1,
      cellRenderer: (props: any) => {
        return (
          <Image
            alt={`${props.value}`}
            src={`${props.value}`}
            width={50}
            height={50}
            className="rounded-full shadow-lg border border-black"
          />
        );
      },
    },
    { field: "id", headerName: "ID", flex: 1, filter: false },
    { field: "first_name", headerName: "Nombre", flex: 1 },
    { field: "last_name", headerName: "Apellido", flex: 1 },
    { field: "role.role_name", headerName: "Rol", flex: 1 },
    {
      field: "actions",
      headerName: "Acciones",
      flex: 1,
      filter: false,
      sortable: false,
      cellRenderer: () => {
        return (
          <div>
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Ver"
              mr={2}
            >
              <FaEye color="blue" />
            </IconButton>
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Editar"
              mr={2}
            >
              <FaEdit color="orange" />
            </IconButton>
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Eliminar"
            >
              <FaTrash color="red" />
            </IconButton>
          </div>
        );
      },
    },
  ]);
  useEffect(() => {
    setRowData([...pacientes]);
  }, [pacientes]);
  return (
    <div className="w-full h-full mb-4">
      <Heading size="lg" mb={4}>
        Pacientes
      </Heading>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        colResizeDefault="shift"
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={{
          resizable: false,
          sortable: true,
          filter: true,
          filterParams: {
            filterOptions: ["contains", "equals"],
            maxNumConditions: 1,
          },
          wrapText: true,
          autoHeight: true,
          minWidth: 100,
          maxWidth: 300,
        }}
        cellSelection={false}
      />
    </div>
  );
}
