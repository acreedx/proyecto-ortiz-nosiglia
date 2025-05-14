import {
  Accordion,
  Box,
  Stack,
  Card,
  CardBody,
  Icon,
  Badge,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
interface Appointment {
  id: string;
  patientName: string;
  date: string;
  time: string;
  reason: string;
  status: "Pendiente" | "Completada" | "Cancelada";
}
export default function AppointmentAccordion() {
  const appointments: Appointment[] = [
    {
      id: "1",
      patientName: "Juan Pérez",
      date: "2025-05-15",
      time: "10:00",
      reason: "Control dental",
      status: "Pendiente",
    },
    {
      id: "2",
      patientName: "María Gómez",
      date: "2025-05-15",
      time: "11:30",
      reason: "Dolor de muela",
      status: "Completada",
    },
    {
      id: "3",
      patientName: "Luis Ortega",
      date: "2025-05-16",
      time: "09:00",
      reason: "Extracción",
      status: "Cancelada",
    },
  ];
  const grouped = {
    Pendiente: appointments.filter((a) => a.status === "Pendiente"),
    Completada: appointments.filter((a) => a.status === "Completada"),
    Cancelada: appointments.filter((a) => a.status === "Cancelada"),
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
                          colorScheme={
                            appt.status === "Pendiente"
                              ? "yellow"
                              : appt.status === "Completada"
                                ? "green"
                                : "red"
                          }
                        >
                          {appt.status}
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
