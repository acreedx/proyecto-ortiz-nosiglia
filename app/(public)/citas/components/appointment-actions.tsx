"use client";
import React from "react";
import { IconButton, UseDialogReturn } from "@chakra-ui/react";
import { FaEdit, FaCalendarCheck, FaTrash, FaEye } from "react-icons/fa";
import { Appointment, Prisma } from "@prisma/client";
import { appointmentStatusList } from "../../../../types/statusList";
import { mostrarAlertaConfirmacion } from "../../../../lib/sweetalert/alerts";
import { confirmAppointment } from "../actions/operations";
import { toaster } from "../../../../components/ui/toaster";

export default function AppointmentActions({
  props,
}: {
  props: {
    appointment: Prisma.AppointmentGetPayload<{
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
    }>;
    createAppointmentDialog: UseDialogReturn;
    editAppointmentDialog: UseDialogReturn;
    completeAppointmentDialog: UseDialogReturn;
    cancelAppointmentDialog: UseDialogReturn;
    viewAppointmentDialog: UseDialogReturn;
    setselectedAppointment: React.Dispatch<
      React.SetStateAction<Appointment | undefined>
    >;
  };
}) {
  const isEditable =
    props.appointment.status !== appointmentStatusList.STATUS_CANCELADA &&
    props.appointment.status !== appointmentStatusList.STATUS_COMPLETADA &&
    props.appointment.status !== appointmentStatusList.STATUS_NO_ASISTIDA &&
    props.appointment.status !== appointmentStatusList.STATUS_CONFIRMADA;

  const handleEdit = async (appointment: Appointment) => {
    props.setselectedAppointment(appointment);
    props.editAppointmentDialog.setOpen(true);
  };
  const handleCancel = async (appointment: Appointment) => {
    props.setselectedAppointment(appointment);
    props.cancelAppointmentDialog.setOpen(true);
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
    props.setselectedAppointment(appointment);
    props.viewAppointmentDialog.setOpen(true);
  };
  return (
    <div className="flex flex-row items-center justify-center w-full gap-1 mt-2">
      {isEditable && (
        <IconButton
          size="sm"
          colorPalette="orange"
          variant="outline"
          aria-label="Editar"
          ml={2}
          onClick={async () => handleEdit(props.appointment)}
        >
          <FaEdit color="orange" />
        </IconButton>
      )}

      {props.appointment.status === appointmentStatusList.STATUS_PENDIENTE && (
        <IconButton
          size="sm"
          colorPalette="teal"
          variant="outline"
          aria-label="Confirmar cita"
          onClick={async () => handleConfirm(props.appointment.id)}
        >
          <FaCalendarCheck color="teal" />
        </IconButton>
      )}

      {isEditable && (
        <IconButton
          size="sm"
          colorPalette="red"
          variant="outline"
          aria-label="Cancelar cita"
          onClick={async () => handleCancel(props.appointment)}
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
          onClick={async () => handleViewDetails(props.appointment)}
        >
          <FaEye color="blue" />
        </IconButton>
      )}
    </div>
  );
}
