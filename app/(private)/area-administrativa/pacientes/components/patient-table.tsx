"use client";
import { Prisma } from "@prisma/client";
import { useEffect, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import Image from "next/image";
import { IconButton } from "@chakra-ui/react";
import { FaEdit, FaEye, FaFile, FaTrash } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PatientTable({
  props,
}: {
  props: {
    pacientes: Prisma.UserGetPayload<{
      include: {
        role: true;
        patient: true;
      };
    }>[];
  };
}) {
  const router = useRouter();
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
    { field: "first_name", headerName: "Nombre" },
    { field: "last_name", headerName: "Apellido" },
    {
      field: "birth_date",
      headerName: "Fecha de nacimiento",
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    { field: "phone", headerName: "Teléfono" },
    { field: "mobile", headerName: "Celular" },
    { field: "address_line", headerName: "Dirección" },
    { field: "address_city", headerName: "Ciudad" },
    {
      field: "patient.allergies",
      headerName: "Alergias",
      valueFormatter: (params) => (params.value ? params.value : "Ninguna"),
    },
    {
      field: "patient.preconditions",
      headerName: "Precondiciones",
      valueFormatter: (params) => (params.value ? params.value : "Ninguna"),
    },
    {
      field: "actions",
      headerName: "Acciones",
      filter: false,
      sortable: false,
      cellRenderer: (params: any) => {
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
              mr={2}
            >
              <FaTrash color="red" />
            </IconButton>
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Odontograma"
              onClick={() => {
                router.push(
                  `/area-administrativa/pacientes/odontograma/${params.data.id}`
                );
              }}
            >
              <FaFile color="gray" />
            </IconButton>
          </div>
        );
      },
    },
  ]);
  useEffect(() => {
    setRowData([...props.pacientes]);
  }, [props.pacientes]);
  return (
    <div className="w-full h-full mb-4">
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
          flex: 1,
          wrapText: true,
          autoHeight: true,
        }}
        suppressCellFocus
        cellSelection={false}
      />
    </div>
  );
}
