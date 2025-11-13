"use client";
import React, { useCallback, useMemo, useState } from "react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { Badge, IconButton, useDialog } from "@chakra-ui/react";
import { FaCheck, FaEdit, FaTrash, FaUndo } from "react-icons/fa";
import { CarePlan } from "@prisma/client";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import {
  treatmentStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { complete, eliminate, restore } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import TreatmentsEditForm from "./treatments-edit-form";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { getCarePlans } from "../data/datasource";

export default function TreatmentsTable({
  props,
}: {
  props: {
    gridApiRef: React.RefObject<GridApi | null>;
    datasourceRef: React.RefObject<IDatasource | null>;
  };
}) {
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
  const editDialog = useDialog();
  const [selectedTreatment, setselectedTreatment] = useState<CarePlan>();
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
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return `${props.data.patient.user.first_name} ${props.data.patient.user.last_name}`;
        }
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
      filter: true,
      headerName: "Estado",
      valueGetter: (params) => {
        if (!params.data) return "—";
        switch (params.data.status) {
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
      valueFormatter: (params) => params.value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        const value = params.value;
        let colorScheme: string;
        switch (value) {
          case "Activo":
            colorScheme = "green";
            break;
          case "Inactivo":
            colorScheme = "gray";
            break;
          case "Completado":
            colorScheme = "blue";
            break;
          default:
            colorScheme = "yellow";
            break;
        }
        return (
          <Badge
            colorPalette={colorScheme}
            variant="solid"
            borderRadius="full"
            px={2}
            py={1}
          >
            {value}
          </Badge>
        );
      },
    },
    {
      field: "actions",
      minWidth: 200,
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return (
            <div className="flex flex-row items-center justify-center w-full">
              {props.data.status === userStatusList.ACTIVO && (
                <Tooltip content="Editar tratamiento">
                  <IconButton
                    size="sm"
                    colorPalette="orange"
                    variant="outline"
                    aria-label="Editar"
                    onClick={() => handleEdit(props.data)}
                  >
                    <FaEdit color="orange" />
                  </IconButton>
                </Tooltip>
              )}
              {props.data.status === userStatusList.ACTIVO && (
                <Tooltip content="Deshabilitar tratamiento">
                  <IconButton
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    aria-label="Desactivar"
                    ml={2}
                    onClick={async () => handleDelete(props.data.id)}
                  >
                    <FaTrash color="red" />
                  </IconButton>
                </Tooltip>
              )}
              {props.data.status === userStatusList.ACTIVO && (
                <Tooltip content="Completar tratamiento">
                  <IconButton
                    size="sm"
                    colorPalette="blue"
                    variant="outline"
                    aria-label="Completar"
                    ml={2}
                    onClick={async () => handleCompleteTreatment(props.data.id)}
                  >
                    <FaCheck color="blue" />
                  </IconButton>
                </Tooltip>
              )}
              {props.data.status === userStatusList.INACTIVO && (
                <Tooltip content="Rehabilitar tratamiento">
                  <IconButton
                    size="sm"
                    colorPalette="green"
                    variant="outline"
                    aria-label="Reactivar"
                    ml={2}
                    onClick={async () => handleRestore(props.data.id)}
                  >
                    <FaUndo color="green" />
                  </IconButton>
                </Tooltip>
              )}
              {/*Agregar la vista para ver la informacion*/}
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
        if (props.gridApiRef.current && props.datasourceRef.current) {
          props.gridApiRef.current.setGridOption(
            "datasource",
            props.datasourceRef.current
          );
        }
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
        if (props.gridApiRef.current && props.datasourceRef.current) {
          props.gridApiRef.current.setGridOption(
            "datasource",
            props.datasourceRef.current
          );
        }
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
      const res = await restore({ id });
      if (res.ok) {
        toaster.create({
          description: "Tratamiento rehabilitado con éxito",
          type: "success",
        });
        if (props.gridApiRef.current && props.datasourceRef.current) {
          props.gridApiRef.current.setGridOption(
            "datasource",
            props.datasourceRef.current
          );
        }
      } else {
        toaster.create({
          description: "Error al rehabilitar el tratamiento",
          type: "error",
        });
      }
    }
  };

  const onGridReady = useCallback((params: GridReadyEvent) => {
    props.gridApiRef.current = params.api;
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getCarePlans({
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
    props.datasourceRef.current = datasource;
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
      <EditDialog dialog={editDialog}>
        <TreatmentsEditForm
          props={{
            treatment: selectedTreatment,
            dialog: editDialog,
            gridApiRef: props.gridApiRef,
            datasourceRef: props.datasourceRef,
          }}
        />
      </EditDialog>
    </div>
  );
}
