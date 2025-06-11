"use client";
import React, { useEffect, useState } from "react";
import type { ColDef } from "ag-grid-community";
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
import { AgGridReact } from "ag-grid-react";
import { Appointment, Prisma, User } from "@prisma/client";
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
ModuleRegistry.registerModules([AllCommunityModule]);

export default function AppointmentsTable({
  props,
}: {
  props: {
    citas: Prisma.AppointmentGetPayload<{
      include: {
        patient: {
          include: {
            user: true;
          };
        };
        doctor: {
          include: {
            staff: {
              include: {
                user: true;
              };
            };
          };
        };
      };
    }>[];
    doctores: User[];
  };
}) {
  const editDialog = useDialog();
  const completeAppointmentDialog = useDialog();
  const cancelAppointmentDialog = useDialog();
  const viewAppointmentDialog = useDialog();
  const [selectedAppointment, setselectedAppointment] = useState<Appointment>();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [rowData, setRowData] = useState<any[]>([]);
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
      valueFormatter: (params) =>
        params.value + " " + params.data.doctor.staff.user.last_name,
    },
    {
      field: "patient.user.first_name",
      headerName: "Paciente",
      filter: true,
      valueFormatter: (params) =>
        params.value + " " + params.data.patient.user.last_name,
    },
    {
      field: "status",
      headerName: "Estado",
      filter: true,
      valueFormatter: (params) => {
        switch (params.value) {
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
      },
    },
    {
      field: "actions",
      headerName: "Acciones",
      sortable: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cellRenderer: (params: any) => {
        const estado = params.data.status;
        const isEditable =
          estado !== appointmentStatusList.STATUS_CANCELADA &&
          estado !== appointmentStatusList.STATUS_COMPLETADA &&
          estado !== appointmentStatusList.STATUS_NO_ASISTIDA;
        return (
          <div className="flex flex-row items-center justify-center w-full gap-1">
            {isEditable && (
              <IconButton
                size="sm"
                colorPalette="orange"
                variant="outline"
                aria-label="Editar"
                ml={2}
                onClick={async () => handleEdit(params.data)}
              >
                <FaEdit color="orange" />
              </IconButton>
            )}

            {estado === appointmentStatusList.STATUS_PENDIENTE && (
              <IconButton
                size="sm"
                colorPalette="teal"
                variant="outline"
                aria-label="Confirmar cita"
                onClick={async () => handleConfirm(params.data.id)}
              >
                <FaCalendarCheck color="teal" />
              </IconButton>
            )}

            {estado === appointmentStatusList.STATUS_CONFIRMADA && (
              <>
                <IconButton
                  size="sm"
                  colorPalette="green"
                  variant="outline"
                  aria-label="Completar cita"
                  onClick={async () => handleComplete(params.data)}
                >
                  <FaCheck color="green" />
                </IconButton>
                <IconButton
                  size="sm"
                  colorPalette="purple"
                  variant="outline"
                  aria-label="Marcar como no asistida"
                  onClick={async () => handleMarkAsMissed(params.data.id)}
                >
                  <FaUserTimes color="purple" />
                </IconButton>
              </>
            )}

            {isEditable && (
              <IconButton
                size="sm"
                colorPalette="red"
                variant="outline"
                aria-label="Cancelar cita"
                onClick={async () => handleCancel(params.data)}
              >
                <FaTrash color="red" />
              </IconButton>
            )}
            {!isEditable && (
              <IconButton
                size="sm"
                colorPalette="blue"
                variant="outline"
                aria-label="Ver detalles de la cita"
                onClick={async () => handleViewDetails(params.data)}
              >
                <FaEye color="blue" />
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
      <EditDialog dialog={editDialog}>
        <AppointmentsEditForm
          props={{
            selectedAppointment: selectedAppointment,
            doctores: props.doctores,
          }}
        />
      </EditDialog>
      <EditDialog dialog={completeAppointmentDialog}>
        <AppointmentsCompleteForm
          props={{
            selectedAppointment: selectedAppointment,
          }}
        />
      </EditDialog>
      <EditDialog dialog={cancelAppointmentDialog}>
        <AppointmentsCancelForm
          props={{
            selectedAppointment: selectedAppointment,
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
