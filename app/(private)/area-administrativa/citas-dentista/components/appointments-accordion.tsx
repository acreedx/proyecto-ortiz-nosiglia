import {
  Accordion,
  Box,
  Stack,
  Card,
  Badge,
  Text,
  UseDialogReturn,
} from "@chakra-ui/react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
import { Appointment, Prisma } from "@prisma/client";
import { appointmentStatusList } from "../../../../../types/statusList";
import { timeFormatter } from "../../../../../types/dateFormatter";
import AppointmentActions from "./appointment-actions";
import {
  statusColorMap,
  statusLabelMap,
} from "../../../../../types/appointmentStatusMaps";

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
    Completada: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_COMPLETADA
    ),
    Cancelada: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_CANCELADA
    ),
    NoAsistida: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_NO_ASISTIDA
    ),
    Confirmada: props.appointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_CONFIRMADA
    ),
  };
  return (
    <div>
      <Accordion.Root multiple defaultValue={[]}>
        {Object.entries(grouped).map(([status, list]) => (
          <Accordion.Item key={status} value={status}>
            <Accordion.ItemTrigger
              _hover={{ bg: "gray.100" }}
              px={4}
              py={2}
              borderBottom="1px solid"
              borderColor="gray.200"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              fontWeight="bold"
            >
              <Box>
                <Text colorPalette={"orange"} color={"orange.400"}>
                  {status} ({list.length})
                </Text>
              </Box>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent px={4} pb={4}>
              {list.length === 0 ? (
                <Text color="gray.500" className="pt-4">
                  No hay citas
                </Text>
              ) : (
                <Stack gap={4} mt={2}>
                  {list.map((appt) => (
                    <Card.Root key={appt.id} variant="outline">
                      <Card.Body>
                        <Stack gap={1}>
                          <Text fontWeight="bold">
                            {appt.patient.user.first_name}{" "}
                            {appt.patient.user.last_name}
                          </Text>
                          <Text>
                            <FaCalendar color="orange" />
                            {new Intl.DateTimeFormat("es-ES", {
                              day: "numeric",
                              month: "numeric",
                              year: "numeric",
                              timeZone: "UTC",
                            })
                              .format(appt.programed_date_time)
                              .toString()}{" "}
                            a las {timeFormatter(appt.programed_date_time)}
                          </Text>
                          <Text color="gray.600">Motivo: {appt.reason}</Text>
                          <Badge
                            colorPalette={
                              appt.status ? statusColorMap[appt.status] : "gray"
                            }
                          >
                            {appt.status ? statusLabelMap[appt.status] : "-"}
                          </Badge>
                          <AppointmentActions
                            props={{
                              appointment: appt,
                              createAppointmentDialog:
                                props.createAppointmentDialog,
                              editAppointmentDialog:
                                props.editAppointmentDialog,
                              completeAppointmentDialog:
                                props.completeAppointmentDialog,
                              cancelAppointmentDialog:
                                props.cancelAppointmentDialog,
                              viewAppointmentDialog:
                                props.viewAppointmentDialog,
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
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </div>
  );
}
