import { Accordion, Box, Stack, Card, Badge, Text } from "@chakra-ui/react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
import { MockAppointment } from "../../../(private)/area-administrativa/citas-dentista/page";
import { appointmentStatusList } from "../../../../types/statusList";
export const statusColorMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "red",
  [appointmentStatusList.STATUS_COMPLETADA]: "green",
  [appointmentStatusList.STATUS_CONFIRMADA]: "blue",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "gray",
  [appointmentStatusList.STATUS_PENDIENTE]: "yellow",
};
export const statusLabelMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "Cancelada",
  [appointmentStatusList.STATUS_COMPLETADA]: "Completada",
  [appointmentStatusList.STATUS_CONFIRMADA]: "Confirmada",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "No Asistida",
  [appointmentStatusList.STATUS_PENDIENTE]: "Pendiente",
};
export default function AppointmentAccordion({
  MockAppointments,
}: {
  MockAppointments: MockAppointment[];
}) {
  const grouped = {
    Pendiente: MockAppointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_PENDIENTE
    ),
    Completada: MockAppointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_COMPLETADA
    ),
    Cancelada: MockAppointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_CANCELADA
    ),
    NoAsistida: MockAppointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_NO_ASISTIDA
    ),
    Confirmada: MockAppointments.filter(
      (a) => a.status === appointmentStatusList.STATUS_CONFIRMADA
    ),
  };
  return (
    <Accordion.Root multiple defaultValue={["Pendiente"]}>
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
              <Text color="gray.500">No hay citas</Text>
            ) : (
              <Stack gap={4} mt={2}>
                {list.map((appt) => (
                  <Card.Root key={appt.id} variant="outline">
                    <Card.Body>
                      <Stack gap={1}>
                        <Text fontWeight="bold">{appt.patientName}</Text>
                        <Text>
                          <FaCalendar color="orange" />
                          {appt.date} a las {appt.time}
                        </Text>
                        <Text color="gray.600">Motivo: {appt.reason}</Text>
                        <Badge
                          colorPalette={statusColorMap[appt.status] || "gray"}
                        >
                          {statusLabelMap[appt.status] || "-"}
                        </Badge>
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
  );
}
