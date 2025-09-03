"use client";
import React, { useCallback, useMemo, useRef, useState } from "react";
import type {
  ColDef,
  GridApi,
  GridReadyEvent,
  IDatasource,
  IGetRowsParams,
} from "ag-grid-community";
import { AG_GRID_LOCALE_ES } from "@ag-grid-community/locale";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { IconButton, useDialog } from "@chakra-ui/react";
import {
  FaEye,
  FaEdit,
  FaTrash,
  FaCheck,
  FaUserTimes,
  FaCalendarCheck,
} from "react-icons/fa";
import { AgGridReact, CustomCellRendererProps } from "ag-grid-react";
import { Appointment, User } from "@prisma/client";
import { appointmentStatusList } from "../../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import {
  confirmAppointment,
  markAppointmentNotAssisted,
} from "../actions/operations";
import AppointmentsEditForm from "./appointments-edit-form";
import AppointmentsCompleteForm from "./appointments-complete-form";
import AppointmentsCancelForm from "./appointments-cancel-form";
import AppointmentsViewForm from "./appointments-view-form";
import { Tooltip } from "../../../../../components/ui/tooltip";
import { getAppointments } from "../data/datasource";
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AppointmentsTable({
  props,
}: {
  props: {
    doctores: User[];
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
  const completeAppointmentDialog = useDialog();
  const cancelAppointmentDialog = useDialog();
  const viewAppointmentDialog = useDialog();
  const [selectedAppointment, setselectedAppointment] = useState<Appointment>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [colDefs, setColDefs] = useState<ColDef[]>([
    {
      field: "programed_date_time",
      headerName: "Fecha Programada",
      valueFormatter: (params) =>
        params.value
          ? new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
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
      field: "doctor.staff.user.first_name",
      headerName: "Doctor",
      filter: true,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          return props.value + " " + props.data.doctor.staff.user.last_name;
        }
      },
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
      field: "status",
      headerName: "Estado",
      filter: true,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.value !== undefined) {
          switch (props.value) {
            case appointmentStatusList.STATUS_CANCELADA:
              return "Cancelada";
            case appointmentStatusList.STATUS_PENDIENTE:
              return "Pendiente";
            case appointmentStatusList.STATUS_CONFIRMADA:
              return "Confirmada";
            case appointmentStatusList.STATUS_COMPLETADA:
              return "Completada";
            case appointmentStatusList.STATUS_NO_ASISTIDA:
              return "No asistida";
            default:
              return "—";
          }
        }
      },
    },
    {
      minWidth: 200,
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      cellRenderer: (props: CustomCellRendererProps) => {
        if (props.data !== undefined) {
          const estado = props.data.status;
          const isEditable =
            estado !== appointmentStatusList.STATUS_CANCELADA &&
            estado !== appointmentStatusList.STATUS_COMPLETADA &&
            estado !== appointmentStatusList.STATUS_NO_ASISTIDA;
          return (
            <div className="flex flex-row items-center justify-center w-full gap-1">
              {isEditable && (
                <Tooltip content="Editar cita">
                  <IconButton
                    size="sm"
                    colorPalette="orange"
                    variant="outline"
                    aria-label="Editar"
                    ml={2}
                    onClick={async () => handleEdit(props.data)}
                  >
                    <FaEdit color="orange" />
                  </IconButton>
                </Tooltip>
              )}

              {estado === appointmentStatusList.STATUS_PENDIENTE && (
                <Tooltip content="Confirmar cita">
                  <IconButton
                    size="sm"
                    colorPalette="teal"
                    variant="outline"
                    aria-label="Confirmar cita"
                    onClick={async () => handleConfirm(props.data.id)}
                  >
                    <FaCalendarCheck color="teal" />
                  </IconButton>
                </Tooltip>
              )}

              {estado === appointmentStatusList.STATUS_CONFIRMADA && (
                <>
                  <Tooltip content="Completar cita">
                    <IconButton
                      size="sm"
                      colorPalette="green"
                      variant="outline"
                      aria-label="Completar cita"
                      onClick={async () => handleComplete(props.data)}
                    >
                      <FaCheck color="green" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Marcar como no asistida">
                    <IconButton
                      size="sm"
                      colorPalette="purple"
                      variant="outline"
                      aria-label="Marcar como no asistida"
                      onClick={async () => handleMarkAsMissed(props.data.id)}
                    >
                      <FaUserTimes color="purple" />
                    </IconButton>
                  </Tooltip>
                </>
              )}

              {isEditable && (
                <Tooltip content="Cancelar cita">
                  <IconButton
                    size="sm"
                    colorPalette="red"
                    variant="outline"
                    aria-label="Cancelar cita"
                    onClick={async () => handleCancel(props.data)}
                  >
                    <FaTrash color="red" />
                  </IconButton>
                </Tooltip>
              )}
              {!isEditable && (
                <Tooltip content="Ver detalles de la cita">
                  <IconButton
                    size="sm"
                    colorPalette="blue"
                    variant="outline"
                    aria-label="Ver detalles de la cita"
                    onClick={async () => handleViewDetails(props.data)}
                  >
                    <FaEye color="blue" />
                  </IconButton>
                </Tooltip>
              )}
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
  const handleEdit = async (appointment: Appointment) => {
    setselectedAppointment(appointment);
    editDialog.setOpen(true);
  };
  const handleCancel = async (appointment: Appointment) => {
    setselectedAppointment(appointment);
    cancelAppointmentDialog.setOpen(true);
  };
  const handleMarkAsMissed = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de marcar la cita como no asistida?",
    });
    if (isConfirmed) {
      const res = await markAppointmentNotAssisted({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Éxito al marcar la cita",
          type: "success",
        });
        if (gridApiRef.current && datasourceRef.current) {
          gridApiRef.current.setGridOption("datasource", datasourceRef.current);
        }
      } else {
        toaster.create({
          description: "Error al marcar la cita",
          type: "error",
        });
      }
    }
  };
  const handleComplete = async (appointment: Appointment) => {
    setselectedAppointment(appointment);
    completeAppointmentDialog.setOpen(true);
  };
  const handleConfirm = async (id: number) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de confirmar esta cita?",
    });
    if (isConfirmed) {
      const res = await confirmAppointment({ id: id });
      if (res.ok) {
        toaster.create({
          description: "Éxito al confirmar la cita",
          type: "success",
        });
        if (gridApiRef.current && datasourceRef.current) {
          gridApiRef.current.setGridOption("datasource", datasourceRef.current);
        }
      } else {
        toaster.create({
          description: "Error al confirmar la cita",
          type: "error",
        });
      }
    }
  };
  const handleViewDetails = async (appointment: Appointment) => {
    setselectedAppointment(appointment);
    viewAppointmentDialog.setOpen(true);
  };
  const onGridReady = useCallback((params: GridReadyEvent) => {
    gridApiRef.current = params.api;
    const datasource: IDatasource = {
      rowCount: undefined,
      getRows: async (gridParams: IGetRowsParams) => {
        try {
          const { rows, total } = await getAppointments({
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
    datasourceRef.current = datasource;
    params.api.setGridOption("datasource", datasource);
  }, []);
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
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
        <AppointmentsEditForm
          props={{
            selectedAppointment: selectedAppointment,
            doctores: props.doctores,
            dialog: editDialog,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      </EditDialog>
      <EditDialog dialog={completeAppointmentDialog}>
        <AppointmentsCompleteForm
          props={{
            selectedAppointment: selectedAppointment,
            dialog: completeAppointmentDialog,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      </EditDialog>
      <EditDialog dialog={cancelAppointmentDialog}>
        <AppointmentsCancelForm
          props={{
            selectedAppointment: selectedAppointment,
            dialog: cancelAppointmentDialog,
            gridApiRef: gridApiRef,
            datasourceRef: datasourceRef,
          }}
        />
      </EditDialog>
      <EditDialog dialog={viewAppointmentDialog}>
        <AppointmentsViewForm
          props={{
            selectedAppointment: selectedAppointment,
          }}
        />
      </EditDialog>
    </div>
  );
}
