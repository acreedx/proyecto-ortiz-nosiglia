"use client";
import type {
  ColDef,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import React, { useCallback, useMemo } from "react";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { getAuditEvents } from "../data/datasource";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function SystemEventsTable() {
  const colDefs: ColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        minWidth: 50,
      },
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
      {
        field: "detail",
        headerName: "Detalle",
        filter: true,
      },
      {
        field: "occurred_date_time",
        headerName: "Fecha y Hora",
        valueFormatter: (params) =>
          params.value
            ? new Intl.DateTimeFormat("es-ES", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(params.value))
            : "",
        minWidth: 150,
      },
      {
        field: "network",
        headerName: "Red",
        filter: true,
        minWidth: 200,
      },
      { field: "person_name", headerName: "Nombre Persona", filter: true },
      { field: "person_role", headerName: "Rol", filter: true },
    ],
    []
  );
  const defaultColDef = useMemo<ColDef>(() => {
    return {
      flex: 1,
      minWidth: 100,
      resizable: false,
      sortable: true,
      filter: false,
      filterParams: {
        filterOptions: ["contains", "equals"],
        maxNumConditions: 1,
      },
    };
  }, []);
  const onGridReady = useCallback((params: GridReadyEvent) => {
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getAuditEvents({
            startRow: gridParams.startRow,
            endRow: gridParams.endRow,
            filterModel: gridParams.filterModel,
            sortModel: gridParams.sortModel,
          });
          gridParams.successCallback(rows, total);
        } catch (err) {
          console.error("Error cargando eventos:", err);
          gridParams.failCallback();
        }
      },
    };
    params.api.setGridOption("datasource", datasource);
  }, []);

  return (
    <div
      className="w-full h-full mb-4 pt-4 ag-theme-quartz"
      style={{ height: "100%", width: "100%" }}
    >
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
