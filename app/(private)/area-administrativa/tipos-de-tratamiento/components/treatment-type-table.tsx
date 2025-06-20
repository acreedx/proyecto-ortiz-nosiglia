"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, useDialog } from "@chakra-ui/react";
import { FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { userStatusList } from "../../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { eliminate, restore } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import { Treatment } from "@prisma/client";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import TreatmentTypeEditForm from "./treatment-type-edit-form";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TreatmentTypeTable({
  props,
}: {
  props: {
    treatments: Treatment[];
  };
}) {
  const editDialog = useDialog();
  const [selectedTreatment, setselectedTreatment] = useState<Treatment>();
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
      field: "estimated_appointments",
      headerName: "Citas Estimadas",
      type: "numberColumn",
    },
    {
      field: "days_between_appointments",
      headerName: "Días entre Citas",
      type: "numberColumn",
    },
    {
      field: "cost_estimation",
      headerName: "Costo Estimado",
      valueFormatter: (params) =>
        params.value
          ? `${parseFloat(params.value.toString()).toFixed(2)} bs`
          : "—",
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
                aria-label="Eliminar"
                ml={2}
                onClick={async () => handleDelete(params.data.id)}
              >
                <FaTrash color="red" />
              </IconButton>
            )}
            {params.data.status === userStatusList.INACTIVO && (
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
  const handleDelete = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de deshabilitar este tratamiento?",
    });
    if (isConfirmed) {
      const res = await eliminate({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Éxito al deshabilitar el tratamiento",
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
      const res = await restore({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Éxito al rehabilitar el tratamiento",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al rehabilitar el tratamiento",
          type: "error",
        });
      }
    }
  };
  const handleEdit = (treatment: Treatment) => {
    editDialog.setOpen(true);
    setselectedTreatment(treatment);
  };
  useEffect(() => {
    setRowData([...props.treatments]);
  }, [props.treatments]);
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
        <TreatmentTypeEditForm
          props={{
            treatment: selectedTreatment,
          }}
        />
      </EditDialog>
    </div>
  );
}
