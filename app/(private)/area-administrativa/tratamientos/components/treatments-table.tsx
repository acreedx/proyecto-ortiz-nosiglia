"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, useDialog } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { CarePlan, Treatment } from "@prisma/client";
import { AgGridReact } from "ag-grid-react";
import {
  treatmentStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { complete, eliminate, restore } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import TreatmentsEditForm from "./treatments-edit-form";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TreatmentsTable({
  props,
}: {
  props: {
    careplans: CarePlan[];
    treatments: Treatment[];
  };
}) {
  const editDialog = useDialog();
  const [selectedTreatment, setselectedTreatment] = useState<CarePlan>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "treatment_type",
      headerName: "Tipo de Tratamiento",
      filter: true,
    },
    {
      field: "title",
      headerName: "Título",
      filter: true,
    },
    {
      field: "start_date",
      headerName: "Fecha de Inicio",
      valueFormatter: (params) =>
        params.value ? new Date(params.value).toLocaleDateString() : "—",
    },
    {
      field: "end_date",
      headerName: "Fecha de Fin",
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
          : "—",
    },
    {
      field: "estimated_appointments",
      headerName: "Citas Estimadas",
    },
    {
      field: "days_between_appointments",
      headerName: "Días entre Citas",
    },
    {
      field: "patient.user.first_name",
      headerName: "Paciente",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        return `
          ${params.data.patient.user.first_name} ${params.data.patient.user.last_name}`;
      },
    },
    {
      field: "cost",
      headerName: "Costo",
      valueFormatter: (params) =>
        params.value
          ? `Bs. ${parseFloat(params.value).toFixed(2)}`
          : "Bs. 0.00",
    },
    {
      field: "status",
      headerName: "Estado",
      valueFormatter: (params) => {
        switch (params.value) {
          case userStatusList.ACTIVO:
            return "Activo";
          case userStatusList.INACTIVO:
            return "Inactivo";
          case treatmentStatusList.COMPLETADO:
            return "Completado";
          default:
            return "—";
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
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                onClick={() => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
            )}
            {params.data.status === userStatusList.ACTIVO && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Desactivar"
                ml={2}
                onClick={async () => handleDelete(params.data.id)}
              >
                <FaTrash color="red" />
              </IconButton>
            )}
            {params.data.status === userStatusList.ACTIVO && (
              <IconButton
                size="sm"
                colorPalette="blue"
                variant="outline"
                aria-label="Completar"
                ml={2}
                onClick={async () => handleCompleteTreatment(params.data.id)}
              >
                <FaCheck color="blue" />
              </IconButton>
            )}
            {params.data.status === userStatusList.INACTIVO ||
              (params.data.status === treatmentStatusList.COMPLETADO && (
                <IconButton
                  size="sm"
                  colorPalette="green"
                  variant="outline"
                  aria-label="Reactivar"
                  ml={2}
                  onClick={async () => handleRestore(params.data.id)}
                >
                  <FaUndo color="green" />
                </IconButton>
              ))}
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
  const handleEdit = (tratamiento: CarePlan) => {
    editDialog.setOpen(true);
    setselectedTreatment(tratamiento);
  };
  const handleCompleteTreatment = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de completar este tratamiento?",
    });
    if (isConfirmed) {
      const res = await complete({
        id: id,
      });
      if (res.ok) {
        toaster.create({
          description: "Tratamiento completado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al completar el tratamiento",
          type: "error",
        });
      }
    }
  };
  const handleDelete = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de deshabilitar este tratamiento?",
    });
    if (isConfirmed) {
      const res = await eliminate({
        id: id,
      });
      if (res.ok) {
        toaster.create({
          description: "Tratamiento deshabiltado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al deshabilitar el tratamiento",
          type: "error",
        });
      }
    }
  };
  const handleRestore = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de rehabilitar este tratamiento?",
    });
    if (isConfirmed) {
      const res = await restore({
        id: id,
      });
      if (res.ok) {
        toaster.create({
          description: "Tratamiento rehabilitado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al rehabilitado el tratamiento",
          type: "error",
        });
      }
    }
  };
  useEffect(() => {
    setRowData([...props.careplans]);
  }, [props.careplans]);
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
      <EditDialog dialog={editDialog}>
        <TreatmentsEditForm
          props={{
            treatment: selectedTreatment,
          }}
        />
      </EditDialog>
    </div>
  );
}
