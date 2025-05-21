"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton } from "@chakra-ui/react";
import { FaEye, FaEdit, FaBan } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { Appointment } from "@prisma/client";
import { userStatusList } from "../../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { cancel } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AppointmentsTable({
  props,
}: {
  props: {
    citas: Appointment[];
  };
}) {
  const [rowData, setRowData] = useState<any[]>([]);
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "scheduled_on",
      headerName: "Fecha de Registro",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })
              .format(new Date(params.value))
              .toString()
          : "",
    },
    {
      field: "programed_date_time",
      headerName: "Fecha Programada",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })
              .format(new Date(params.value))
              .toString()
          : "",
    },
    { field: "specialty", headerName: "Especialidad", filter: true },
    { field: "reason", headerName: "Motivo", filter: true },
    {
      field: "note",
      headerName: "Nota",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "patient_instruction",
      headerName: "Instrucciones",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "cancellation_date",
      headerName: "Fecha de Cancelación",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleString() : "—",
    },
    {
      field: "cancellation_reason",
      headerName: "Motivo Cancelación",
      filter: true,
      valueFormatter: (params) => params.value ?? "—",
    },
    {
      field: "is_cancelled",
      headerName: "Cancelado",
      valueFormatter: (params) => (params.value ? "Sí" : "No"),
    },
    {
      field: "status",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.BLOQUEADO:
            return "Cancelado";
          case userStatusList.INACTIVO:
            return "Finalizado";
          default:
            return "—";
        }
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (params: any) => {
        return (
          <div className="flex flex-row items-center justify-center w-full">
            <IconButton
              size="sm"
              colorPalette="blue"
              variant="outline"
              aria-label="Ver Detalles"
              //onClick={async () => handleViewDetails(params.data)}
            >
              <FaEye color="blue" />
            </IconButton>
            {!params.data.is_cancelled && (
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                ml={2}
                //onClick={async () => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
            )}
            {!params.data.is_cancelled && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Cancelar"
                ml={2}
                onClick={async () => handleCancel(params.data)}
              >
                <FaBan color="red" />
              </IconButton>
            )}
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
  const handleEdit = async () => {};
  const handleCancel = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de cancelar esta cita?",
    });
    if (isConfirmed) {
      const res = await cancel({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Éxito al cancelar la cita",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al cancelar la cita",
          type: "error",
        });
      }
    }
  };
  const handleViewDetails = async () => {};
  useEffect(() => {
    setRowData([...props.citas]);
  }, [props.citas]);
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
