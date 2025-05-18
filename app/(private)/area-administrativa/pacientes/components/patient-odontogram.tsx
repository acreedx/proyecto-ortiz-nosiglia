"use client";
import { OdontogramRow } from "@prisma/client";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import type { ColDef, DataTypeDefinition } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { useEffect, useMemo, useRef, useState } from "react";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import { editRow } from "../actions/operations";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function PatientOdontogram({
  props,
}: {
  props: {
    odontogramRows: OdontogramRow[] | undefined;
  };
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "msc",
      headerName: "Msc",
    },
    { field: "temp", headerName: "Temp" },
    { field: "pieza", headerName: "Pieza" },
    {
      field: "fecha",
      headerName: "Fecha",
      editable: true,
      cellDataType: "dateString",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "",
    },
    {
      field: "diagnostico",
      headerName: "Diagnóstico",
      editable: true,
    },
    { field: "tratamiento", headerName: "Tratamiento", editable: true },
    { field: "created_at", sort: "asc", hide: true },
  ]);
  const dataTypeDefinitions = useMemo<{
    [cellDataType: string]: DataTypeDefinition;
  }>(() => {
    return {
      dateString: {
        baseDataType: "dateString",
        extendsDataType: "dateString",
        valueParser: (params) =>
          params.newValue != null &&
          params.newValue.match("\\d{2}/\\d{2}/\\d{4}")
            ? params.newValue
            : null,
        valueFormatter: (params) => (params.value == null ? "" : params.value),
        dataTypeMatcher: (value) =>
          typeof value === "string" && !!value.match("\\d{2}/\\d{2}/\\d{4}"),
        dateParser: (value) => {
          if (value == null || value === "") {
            return undefined;
          }

          const dateParts = new Date(value).toLocaleDateString().split("/");
          console.log(dateParts);
          return dateParts.length === 3
            ? new Date(
                parseInt(dateParts[2]),
                parseInt(dateParts[1]) - 1,
                parseInt(dateParts[0])
              )
            : undefined;
        },
        dateFormatter: (value) => {
          if (value == null) {
            return undefined;
          }
          const date = String(value.getDate());
          const month = String(value.getMonth() + 1);
          return `${month.length === 1 ? "0" + month : month}/${date.length === 1 ? "0" + date : date}/${value.getFullYear()}`;
        },
      },
    };
  }, []);

  useEffect(() => {
    setRowData(props.odontogramRows ? [...props.odontogramRows] : []);
  }, [props.odontogramRows]);
  const gridRef = useRef<AgGridReact>(null);
  return (
    <div className="w-full h-full mb-4 mt-2">
      <AgGridReact
        ref={gridRef}
        undoRedoCellEditing={true}
        rowData={rowData}
        columnDefs={colDefs}
        colResizeDefault="shift"
        pagination
        localeText={AG_GRID_LOCALE_ES}
        editType="fullRow"
        onRowEditingStopped={async (params) => {
          const isConfirmed = await mostrarAlertaConfirmacion({
            mensaje: "Esta seguro de editar esta fila?",
          });
          if (isConfirmed) {
            const toastId = toaster.create({
              description: "Actualizando datos...",
              type: "loading",
            });
            const res = await editRow({
              data: {
                id: params.data.id,
                fecha: params.data.fecha,
                diagnostico: params.data.diagnostico,
                tratamiento: params.data.tratamiento,
              },
            });
            if (res.ok) {
              toaster.update(toastId, {
                description: "Fila editada con éxito",
                type: "success",
                duration: 3000,
              });
            } else {
              toaster.update(toastId, {
                description: "Error al editar la fila",
                type: "error",
                duration: 3000,
              });
            }
          } else {
            gridRef.current!.api.undoCellEditing();
          }
        }}
        defaultColDef={{
          resizable: false,
          sortable: false,
          filter: false,
          filterParams: {
            filterOptions: ["contains", "equals"],
            maxNumConditions: 1,
          },
          flex: 1,
          wrapText: true,
          autoHeight: true,
        }}
        dataTypeDefinitions={dataTypeDefinitions}
        suppressCellFocus
        cellSelection={false}
      />
    </div>
  );
}
