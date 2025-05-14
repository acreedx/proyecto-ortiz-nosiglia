import { Box, Heading, Stack, Card, Text } from "@chakra-ui/react";
import React from "react";
import { FaCalendar } from "react-icons/fa";
export interface Appointment {
  id: string;
  doctorName: string;
  date: Date;
  time: string;
  reason: string;
}
export default function AppointmentsList() {
  const mockAppointments: Appointment[] = [
    {
      id: "1",
      doctorName: "Juan Pérez",
      date: new Date("2025-05-15"),
      time: "10:00",
      reason: "Control dental",
    },
    {
      id: "2",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
    {
      id: "3",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
    {
      id: "4",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
    {
      id: "5",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
    {
      id: "6",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
    {
      id: "7",
      doctorName: "María Gómez",
      date: new Date("2025-05-15"),
      time: "11:30",
      reason: "Dolor de muela",
    },
  ];
  return (
    <Box p={4}>
      <Heading size="lg" mb={4}>
        Citas programadas
      </Heading>
      <Stack gap={4} overflowY="auto" h="calc(100vh - 100px)">
        {mockAppointments.map((appt) => (
          <Card.Root key={appt.id} variant="outline" borderColor="gray.200">
            <Card.Body>
              <Stack gap={1}>
                <Text fontWeight="bold">{appt.doctorName}</Text>
                <Text className="flex flex-row gap-1 items-center">
                  <FaCalendar color="orange" />
                  {appt.date.toLocaleDateString()} a las {appt.time}
                </Text>
                <Text color="gray.600">Motivo: {appt.reason}</Text>
              </Stack>
            </Card.Body>
          </Card.Root>
        ))}
      </Stack>
    </Box>
  );
}
