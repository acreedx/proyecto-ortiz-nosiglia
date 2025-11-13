"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { Prisma } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import { IconButton, Image } from "@chakra-ui/react";
import { FaMoneyBill, FaScroll } from "react-icons/fa";
import NextLink from "next/link";
import { userStatusList } from "../../../../../types/statusList";
import EditPayrollForm from "./payroll-edit-form";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { dialog } from "../../../../../providers/DialogProvider";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function StaffTable({
  props,
}: {
  props: {
    personal: Prisma.UserGetPayload<{
      include: {
        staff: {
          include: {
            payroll: true;
          };
        };
        role: true;
      };
    }>[];
  };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "photo_url",
      headerName: "Foto",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    { field: "role.role_name", headerName: "Rol" },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => (
        <div className="flex flex-row items-center justify-center w-full">
          <Tooltip content="Ver pagos del empleado">
            <IconButton
              size="sm"
              colorPalette="red"
              variant="outline"
              aria-label="Pagos"
              ml={2}
              onClick={() => {
                dialog.open("Edit Dialog", {
                  content: <EditPayrollForm user={params.data} />,
                });
              }}
            >
              <FaMoneyBill color="green" />
            </IconButton>
          </Tooltip>
          {(params.data.role.role_name === rolesList.DENTISTA ||
            params.data.role.role_name === rolesList.MEDICO_TEMPORAL) && (
            <Tooltip content="Ver títulos del empleado">
              <NextLink
                href={`/area-administrativa/personal/qualifications/${params.data.id}`}
              >
                <IconButton
                  size="sm"
                  colorPalette="red"
                  variant="outline"
                  aria-label="Pagos"
                  ml={2}
                >
                  <FaScroll color="golden" />
                </IconButton>
              </NextLink>
            </Tooltip>
          )}
        </div>
      ),
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
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
