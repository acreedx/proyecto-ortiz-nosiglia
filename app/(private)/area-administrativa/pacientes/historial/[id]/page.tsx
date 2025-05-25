import {
  Box,
  Card,
  Heading,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import { rolesList } from "../../../../../../lib/nextauth/rolesList";
import { prisma } from "../../../../../../lib/prisma/prisma";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import { FaArrowCircleLeft } from "react-icons/fa";
import { userStatusList } from "../../../../../../types/statusList";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = await params;
  const historialPaciente = await prisma.user.findUnique({
    where: {
      id: Number(id),
      role: {
        role_name: rolesList.PACIENTE,
      },
      OR: [
        {
          status: userStatusList.ACTIVO,
        },
        {
          status: userStatusList.NUEVO,
        },
      ],
    },
    include: {
      patient: {
        include: {
          care_plan: true,
          appointment: true,
          encounter: true,
          emergency_contact: true,
          imaging_study: true,
          odontogram: {
            include: {
              odontogram_row: true,
            },
          },
          organization: true,
        },
      },
    },
  });
  if (!historialPaciente) return <div>Paciente no encontrado</div>;
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <Link
          href="/area-administrativa/pacientes"
          colorPalette={"orange"}
          w={"fit-content"}
          mb={2}
        >
          <Icon>
            <FaArrowCircleLeft />
          </Icon>
          Volver
        </Link>
        <BreadCrumb
          pageName={`Historial del paciente ${historialPaciente.first_name} ${historialPaciente.last_name}`}
        />
        <Heading size="lg" mb={4}>
          Historial del paciente {historialPaciente.first_name}{" "}
          {historialPaciente.last_name}
        </Heading>
        <Stack gap={6}>
          {/* Datos personales */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Datos personales</Heading>
            </Card.Header>
            <Card.Body>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                <Box>
                  <Text>
                    <strong>Nombre:</strong> {historialPaciente.first_name}{" "}
                    {historialPaciente.last_name}
                  </Text>
                  <Text>
                    <strong>Identificación:</strong>{" "}
                    {historialPaciente.identification}
                  </Text>
                  <Text>
                    <strong>Fecha de nacimiento:</strong>{" "}
                    {new Date(
                      historialPaciente.birth_date
                    ).toLocaleDateString()}
                  </Text>
                  <Text>
                    <strong>Correo:</strong> {historialPaciente.email}
                  </Text>
                </Box>
                <Box>
                  <Text>
                    <strong>Teléfono:</strong> {historialPaciente.phone}
                  </Text>
                  <Text>
                    <strong>Celular:</strong> {historialPaciente.mobile}
                  </Text>
                  <Text>
                    <strong>Dirección:</strong> {historialPaciente.address_line}
                    , {historialPaciente.address_city}
                  </Text>
                  <Text>
                    <strong>Seguro:</strong>{" "}
                    {historialPaciente.patient?.organization
                      ? historialPaciente.patient?.organization.name
                      : "Ninguno"}
                  </Text>
                </Box>
              </SimpleGrid>
            </Card.Body>
          </Card.Root>

          {/* Antecedentes médicos */}
          <Card.Root>
            <Card.Header>
              <Heading size="md">Antecedentes médicos</Heading>
            </Card.Header>
            <Card.Body>
              <Text>
                <strong>Alergias:</strong>{" "}
                {historialPaciente.patient?.allergies || "No registradas"}
              </Text>
              <Text>
                <strong>Condiciones preexistentes:</strong>{" "}
                {historialPaciente.patient?.preconditions || "No registradas"}
              </Text>
            </Card.Body>
          </Card.Root>

          {/* Contacto de emergencia */}
          {historialPaciente.patient?.emergency_contact && (
            <Card.Root>
              <Card.Header>
                <Heading size="md">Contacto de emergencia</Heading>
              </Card.Header>
              <Card.Body>
                <Text>
                  <strong>Nombre:</strong>{" "}
                  {historialPaciente.patient.emergency_contact.name}
                </Text>
                <Text>
                  <strong>Teléfono:</strong>{" "}
                  {historialPaciente.patient.emergency_contact.phone}
                </Text>
                <Text>
                  <strong>Relación:</strong>{" "}
                  {historialPaciente.patient.emergency_contact.relation}
                </Text>
              </Card.Body>
            </Card.Root>
          )}

          {/* Odontograma */}
          {historialPaciente.patient?.odontogram && (
            <Card.Root>
              <Card.Header>
                <Heading size="md">Odontograma</Heading>
              </Card.Header>
              <Card.Body>
                <Text>
                  <strong>Total de filas:</strong>{" "}
                  {historialPaciente.patient.odontogram.odontogram_row.length}
                </Text>
              </Card.Body>
            </Card.Root>
          )}

          {/* Estudios de imagen */}
          {historialPaciente.patient?.imaging_study &&
            historialPaciente.patient?.imaging_study.length > 0 && (
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Estudios de imagen</Heading>
                </Card.Header>
                <Card.Body>
                  <Stack gap={3}>
                    {historialPaciente.patient.imaging_study.map(
                      (study, index) => (
                        <Box
                          key={index}
                          p={3}
                          borderWidth="1px"
                          borderRadius="md"
                          bg="gray.50"
                        >
                          <Text>
                            <strong>Descripción:</strong>{" "}
                            {study.description || "Sin descripción"}
                          </Text>
                          <Text>
                            <strong>Fecha:</strong>{" "}
                            {study.created_at?.toLocaleDateString()}
                          </Text>
                        </Box>
                      )
                    )}
                  </Stack>
                </Card.Body>
              </Card.Root>
            )}

          {/* Citas */}
          {historialPaciente.patient?.appointment &&
          historialPaciente.patient?.appointment.length > 0 ? (
            <Card.Root>
              <Card.Header>
                <Heading size="md">Citas</Heading>
              </Card.Header>
              <Card.Body>
                <Stack gap={3}>
                  {historialPaciente.patient.appointment.map((appt, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="gray.50"
                    >
                      <Text>
                        <strong>Fecha:</strong>{" "}
                        {new Date(
                          appt.programed_date_time
                        ).toLocaleDateString()}
                      </Text>
                      <Text>
                        <strong>Motivo:</strong>{" "}
                        {appt.reason || "No especificado"}
                      </Text>
                    </Box>
                  ))}
                </Stack>
              </Card.Body>
            </Card.Root>
          ) : (
            <div>Ninguna</div>
          )}

          {/* Tratamientos */}
          {historialPaciente.patient?.care_plan &&
          historialPaciente.patient?.care_plan.length > 0 ? (
            <div>Tratamientos</div>
          ) : (
            <div>Ninguno</div>
          )}
        </Stack>
      </main>
    </CanStaff>
  );
}
