"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaFileContract } from "react-icons/fa";
import { Prisma } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import NextLink from "next/link";
import { Tooltip } from "../../../../../components/ui/tooltip";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DebtsTable({
  props,
}: {
  props: {
    accounts: Prisma.AccountGetPayload<{
      include: {
        patient: {
          include: {
            user: true;
          };
        };
      };
    }>[];
  };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "balance",
      headerName: "Deuda total",
      valueFormatter: (params) =>
        params.value
          ? `Bs. ${parseFloat(params.value).toFixed(2)}`
          : "Bs. 0.00",
    },
    {
      field: "billing_status",
      headerName: "Estado",
      filter: true,
    },
    {
      field: "calculated_at",
      headerName: "Fecha de cálculo",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false, // para formato 24h
              // timeZone: "UTC",  // eliminar si quieres hora local
            })
              .format(new Date(params.value))
              .toString()
          : "—",
    },
    {
      field: "patient.user.first_name",
      headerName: "Paciente",
      valueFormatter: (params) =>
        params.value + " " + params.data.patient.user.last_name,
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full">
            <Tooltip content="Ver detalle de la deuda">
              <NextLink
                href={`/area-administrativa/deudas/pagos/${params.data.patient.user.id}`}
              >
                <IconButton
                  size="sm"
                  colorPalette="white"
                  variant="outline"
                  aria-label="Deudas"
                >
                  <FaFileContract color="gray" />
                </IconButton>
              </NextLink>
            </Tooltip>
          </div>
        );
      },
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);

  useEffect(() => {
    setRowData([...props.accounts]);
  }, [props.accounts]);

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
