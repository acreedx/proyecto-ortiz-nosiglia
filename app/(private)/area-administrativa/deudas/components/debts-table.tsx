"use client";
import React, { useCallback, useMemo, useState } from "react";
import type {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaFileContract } from "react-icons/fa";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import NextLink from "next/link";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { getAccounts } from "../data/datasource";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function DebtsTable() {
  const defaultColDef = useMemo<ColDef>(
    () => ({
      flex: 1,
      minWidth: 100,
      resizable: false,
      sortable: true,
      filter: false,
      filterParams: {
        filterOptions: ["contains", "equals"],
        maxNumConditions: 1,
      },
    }),
    []
  );
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
      filter: true,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return props.value + " " + props.data.patient.user.last_name;
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return (
            <div className="flex flex-row items-center justify-center w-full">
              <Tooltip content="Ver detalle de la deuda">
                <NextLink
                  href={`/area-administrativa/deudas/pagos/${props.data.patient.user.id}`}
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
        }
      },
    },
    {
      field: "created_at",
      sort: "asc",
      hide: true,
    },
  ]);

  const onGridReady = useCallback((params: GridReadyEvent) => {
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getAccounts({
            startRow: gridParams.startRow,
            endRow: gridParams.endRow,
            filterModel: gridParams.filterModel,
            sortModel: gridParams.sortModel,
          });
          gridParams.successCallback(rows, total);
        } catch (err) {
          console.error("Error cargando pacientes:", err);
          gridParams.failCallback();
        }
      },
    };
    params.api.setGridOption("datasource", datasource);
  }, []);
  return (
    <div className="w-full h-full mb-4 pt-4">
      <AgGridReact
        columnDefs={colDefs}
        rowBuffer={0}
        colResizeDefault="shift"
        rowModelType="infinite"
        cacheBlockSize={100}
        maxBlocksInCache={10}
        maxConcurrentDatasourceRequests={1}
        cacheOverflowSize={2}
        infiniteInitialRowCount={20}
        paginationPageSize={20}
        pagination
        localeText={AG_GRID_LOCALE_ES}
        defaultColDef={defaultColDef}
        suppressCellFocus
        cellSelection={false}
        onGridReady={onGridReady}
      />
    </div>
  );
}
