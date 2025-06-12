import {
  Box,
  Stack,
  Card,
  Badge,
  Text,
  UseDialogReturn,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import { FaCalendar, FaTimesCircle } from "react-icons/fa";
import { Appointment, Prisma } from "@prisma/client";
import AppointmentActions from "./appointment-actions";
import { appointmentStatusList } from "../../../../types/statusList";
import { timeFormatter } from "../../../../types/dateFormatter";
import {
  statusColorMap,
  statusLabelMap,
} from "../../../../types/appointmentStatusMaps";

export default function AppointmentAccordion({
  props,
}: {
  props: {
    appointments: Prisma.AppointmentGetPayload<{
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
  const grouped = {
    Pendiente: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_PENDIENTE
    ),
    Confirmada: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_CONFIRMADA
    ),
    Historial: props.appointments.filter(
      (a) =>
        a.status === appointmentStatusList.STATUS_COMPLETADA ||
        a.status === appointmentStatusList.STATUS_CANCELADA ||
        a.status === appointmentStatusList.STATUS_NO_ASISTIDA
    ),
  };
  return (
    <Tabs.Root
      defaultValue={"Pendiente"}
      variant="plain"
      w="full"
      fitted
      pt={2}
    >
      <Tabs.List bg="bg.muted" rounded="l3" p="1">
        {Object.entries(grouped).map(([status, list]) => (
          <Tabs.Trigger key={status} value={status}>
            {status} ({list.length})
          </Tabs.Trigger>
        ))}
        <Tabs.Indicator rounded="l2" />
      </Tabs.List>

      {Object.entries(grouped).map(([status, list]) => (
        <Tabs.Content key={status} value={status} pt={0}>
          <Box p={4}>
            {list.length === 0 ? (
              <Text color="gray.500" className="pt-4">
                No hay citas
              </Text>
            ) : (
              <Stack gap={4} mt={2} mb={4} maxH={690} overflowY="scroll">
                {list.map((appt) => (
                  <Card.Root key={appt.id} variant="outline">
                    <Card.Body>
                      <Stack gap={1}>
                        <Text fontWeight="bold">
                          {appt.patient.user.first_name}{" "}
                          {appt.patient.user.last_name}
                        </Text>
                        <Text className="flex items-center">
                          <FaCalendar color="orange" className="mr-1" />
                          {new Intl.DateTimeFormat("es-ES", {
                            day: "numeric",
                            month: "numeric",
                            year: "numeric",
                            timeZone: "UTC",
                          }).format(appt.programed_date_time)}{" "}
                          a las {timeFormatter(appt.programed_date_time)} -{" "}
                          {timeFormatter(appt.programed_end_date_time)}
                        </Text>
                        <Text>Motivo: {appt.reason}</Text>
                        <Badge
                          colorPalette={
                            appt.status ? statusColorMap[appt.status] : "gray"
                          }
                        >
                          {appt.status ? statusLabelMap[appt.status] : "-"}
                        </Badge>
                        {appt.programed_date_time > new Date() &&
                          appt.programed_end_date_time < new Date() && (
                            <Text color={"green"} fontSize={"sm"}>
                              Cita actual
                            </Text>
                          )}
                        {appt.programed_date_time < new Date() &&
                          appt.status ===
                            appointmentStatusList.STATUS_PENDIENTE && (
                            <Text color={"red"} fontSize={"sm"}>
                              Cita con retraso
                            </Text>
                          )}
                        {appt.status ===
                          appointmentStatusList.STATUS_CANCELADA && (
                          <>
                            <Text color={"black"} className="flex items-center">
                              <FaTimesCircle color="red" className="mr-1" />
                              Motivo de cancelación: {appt.cancellation_reason}
                            </Text>
                            <Text color={"black"} className="flex items-center">
                              <FaCalendar color="red" className="mr-1" />
                              Fecha de cancelación:{" "}
                              {appt.cancellation_date ? (
                                <>
                                  {new Intl.DateTimeFormat("es-ES", {
                                    day: "numeric",
                                    month: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }).format(appt.cancellation_date)}{" "}
                                </>
                              ) : (
                                "-"
                              )}
                            </Text>
                          </>
                        )}
                        <AppointmentActions
                          props={{
                            appointment: appt,
                            createAppointmentDialog:
                              props.createAppointmentDialog,
                            editAppointmentDialog: props.editAppointmentDialog,
                            completeAppointmentDialog:
                              props.completeAppointmentDialog,
                            cancelAppointmentDialog:
                              props.cancelAppointmentDialog,
                            viewAppointmentDialog: props.viewAppointmentDialog,
                            setselectedAppointment:
                              props.setselectedAppointment,
                          }}
                        />
                      </Stack>
                    </Card.Body>
                  </Card.Root>
                ))}
              </Stack>
            )}
          </Box>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  );
}
