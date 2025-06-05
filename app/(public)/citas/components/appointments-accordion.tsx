import { Accordion, Box, Stack, Card, Badge, Text } from "@chakra-ui/react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
import { appointmentStatusList } from "../../../../types/statusList";
import { Prisma } from "@prisma/client";
import { timeFormatter } from "../../../../types/dateFormatter";
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
  appointments,
}: {
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
}) {
  const grouped = {
    Pendiente: appointments
      .filter((a) => a.status === appointmentStatusList.STATUS_PENDIENTE)
      .sort(
        (a, b) =>
          new Date(a.programed_date_time).getTime() -
          new Date(b.programed_date_time).getTime()
      ),
    Completada: appointments
      .filter((a) => a.status === appointmentStatusList.STATUS_COMPLETADA)
      .sort(
        (a, b) =>
          new Date(a.programed_date_time).getTime() -
          new Date(b.programed_date_time).getTime()
      ),
    Cancelada: appointments
      .filter((a) => a.status === appointmentStatusList.STATUS_CANCELADA)
      .sort(
        (a, b) =>
          new Date(a.programed_date_time).getTime() -
          new Date(b.programed_date_time).getTime()
      ),
    NoAsistida: appointments
      .filter((a) => a.status === appointmentStatusList.STATUS_NO_ASISTIDA)
      .sort(
        (a, b) =>
          new Date(a.programed_date_time).getTime() -
          new Date(b.programed_date_time).getTime()
      ),
    Confirmada: appointments
      .filter((a) => a.status === appointmentStatusList.STATUS_CONFIRMADA)
      .sort(
        (a, b) =>
          new Date(a.programed_date_time).getTime() -
          new Date(b.programed_date_time).getTime()
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
