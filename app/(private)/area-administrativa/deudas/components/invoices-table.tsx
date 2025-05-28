"use client";
import { IconButton } from "@chakra-ui/react";
import { Invoice } from "@prisma/client";
import { ColDef } from "ag-grid-community";
import React, { useEffect, useState } from "react";
import { FaFileContract, FaFileInvoice, FaPrint } from "react-icons/fa";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AgGridReact } from "ag-grid-react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import { userStatusList } from "../../../../../types/statusList";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function InvoicesTable({
  props,
}: {
  props: {
    invoices: Invoice[];
  };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "type",
      headerName: "Tipo de recibo",
    },
    {
      field: "note",
      headerName: "Nota",
    },
    {
      field: "date_issued",
      headerName: "Fecha",
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
      field: "total",
      headerName: "Total",
    },
    {
      field: "status",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Activo";
          default:
            return "-";
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full">
            {params.data.status === userStatusList.ACTIVO && (
              <IconButton
                size="sm"
                colorPalette="green"
                variant="outline"
                aria-label="Pagar deudas"
                mr={2}
                onClick={async () => {
                  const isConfirmed = await mostrarAlertaConfirmacion({
                    mensaje: "Esta seguro de confirmar el pago?",
                  });
                  if (isConfirmed) {
                    toaster.create({
                      description: "Pago registrado con éxito",
                      type: "success",
                    });
                  }
                }}
              >
                <FaFileInvoice color="green" />
              </IconButton>
            )}
            <IconButton
              size="sm"
              colorPalette="gray"
              variant="outline"
              aria-label="Imprimir recibo"
              onClick={async () => {
                const isConfirmed = await mostrarAlertaConfirmacion({
                  mensaje: "Quiere imprimir el recibo?",
                });
              }}
            >
              <FaPrint color="gray" />
            </IconButton>
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
    setRowData([...props.invoices]);
  }, [props.invoices]);
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
