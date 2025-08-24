"use client";
import { Dispatch, SetStateAction } from "react";
import { appointmentStatusList } from "../../../../../types/statusList";
import { IconButton, UseDialogReturn } from "@chakra-ui/react";
import {
  FaEdit,
  FaCalendarCheck,
  FaCheck,
  FaUserTimes,
  FaTrash,
  FaEye,
} from "react-icons/fa";
import { Prisma } from "@prisma/client";
import { toaster } from "../../../../../components/ui/toaster";
import {
  confirmAppointment,
  markAppointmentNotAssisted,
} from "../../citas/actions/operations";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { Tooltip } from "../../../../../components/ui/tooltip";

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
    setselectedAppointment: Dispatch<
      SetStateAction<
        | Prisma.AppointmentGetPayload<{
            include: {
              patient: { include: { user: true } };
              doctor: { include: { staff: { include: { user: true } } } };
            };
          }>
        | undefined
      >
    >;
  };
}) {
  const isEditable =
    props.appointment.status !== appointmentStatusList.STATUS_CANCELADA &&
    props.appointment.status !== appointmentStatusList.STATUS_COMPLETADA &&
    props.appointment.status !== appointmentStatusList.STATUS_NO_ASISTIDA;

  const handleEdit = async (
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
    }>
  ) => {
    props.setselectedAppointment(appointment);
    props.editAppointmentDialog.setOpen(true);
  };
  const handleCancel = async (
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
    }>
  ) => {
    props.setselectedAppointment(appointment);
    props.cancelAppointmentDialog.setOpen(true);
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
  const handleComplete = async (
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
    }>
  ) => {
    props.setselectedAppointment(appointment);
    props.completeAppointmentDialog.setOpen(true);
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
  const handleViewDetails = async (
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
    }>
  ) => {
    props.setselectedAppointment(appointment);
    props.viewAppointmentDialog.setOpen(true);
  };
  return (
    <div className="flex flex-row items-center justify-center w-full gap-1 mt-2">
      {isEditable && (
        <Tooltip content="Editar cita">
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
        </Tooltip>
      )}

      {props.appointment.status === appointmentStatusList.STATUS_PENDIENTE && (
        <Tooltip content="Confirmar cita">
          <IconButton
            size="sm"
            colorPalette="teal"
            variant="outline"
            aria-label="Confirmar cita"
            onClick={async () => handleConfirm(props.appointment.id)}
          >
            <FaCalendarCheck color="teal" />
          </IconButton>
        </Tooltip>
      )}

      {props.appointment.status === appointmentStatusList.STATUS_CONFIRMADA && (
        <>
          <Tooltip content="Completar cita">
            <IconButton
              size="sm"
              colorPalette="green"
              variant="outline"
              aria-label="Completar cita"
              onClick={async () => handleComplete(props.appointment)}
            >
              <FaCheck color="green" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Marcar cita como no asistida">
            <IconButton
              size="sm"
              colorPalette="purple"
              variant="outline"
              aria-label="Marcar como no asistida"
              onClick={async () => handleMarkAsMissed(props.appointment.id)}
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
            onClick={async () => handleCancel(props.appointment)}
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
            onClick={async () => handleViewDetails(props.appointment)}
          >
            <FaEye color="blue" />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
}
