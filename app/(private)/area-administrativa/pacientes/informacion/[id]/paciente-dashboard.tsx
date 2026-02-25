"use client";
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Icon,
  Text,
  Grid,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import React from "react";
import {
  FaTooth,
  FaXRay,
  FaFileMedical,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";

function PacienteDashboard({
  paciente,
}: {
  paciente: Prisma.UserGetPayload<{
    include: {
      patient: {
        include: {
          odontogram: {
            include: {
              odontogram_row: true;
            };
          };
        };
      };
    };
  }>;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Box p={6} bg="white" borderRadius="2xl" boxShadow="sm">
        <Grid
          templateColumns={{ base: "1fr", md: "300px 1fr" }}
          gap={8}
          alignItems="center"
        >
          <Box>
            <Heading size="lg">
              {paciente.first_name} {paciente.last_name}
            </Heading>
            <Text color="gray.500" fontSize="sm">
              CI: {paciente.identification}
            </Text>
          </Box>

          <SimpleGrid columns={{ base: 1, sm: 2 }} gapX={10} gapY={4}>
            <InfoItem label="Teléfono" value={paciente.phone} />
            <InfoItem label="Email" value={paciente.email} />
            <InfoItem
              label="Fecha de nacimiento"
              value={
                paciente.birth_date
                  ? new Date(paciente.birth_date).toLocaleDateString()
                  : "—"
              }
            />
            <InfoItem label="Celular" value={paciente.mobile} />
            <InfoItem label="Teléfono" value={paciente.phone} />
          </SimpleGrid>
        </Grid>
      </Box>
      <Box p={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          <ActionCard
            icon={FaTooth}
            title="Odontograma"
            description="Visualiza y edita el estado dental"
            href={`/area-administrativa/pacientes/${paciente.id}/odontograma`}
          />

          <ActionCard
            icon={FaXRay}
            title="Radiografías"
            description="Consulta estudios radiológicos"
            href={`/area-administrativa/pacientes/${paciente.id}/radiografias`}
          />

          <ActionCard
            icon={FaFileMedical}
            title="Historial Clínico"
            description="Tratamientos y evolución"
            href={`/area-administrativa/pacientes/${paciente.id}/historial`}
          />

          <ActionCard
            icon={FaUser}
            title="Datos Personales"
            description="Información general del paciente"
            href={`/area-administrativa/pacientes/${paciente.id}/datos`}
          />

          <ActionCard
            icon={FaCalendarAlt}
            title="Citas"
            description="Agenda y consultas programadas"
            href={`/area-administrativa/pacientes/${paciente.id}/citas`}
          />
        </SimpleGrid>
      </Box>
    </div>
  );
}

export default PacienteDashboard;

interface ActionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
  href: string;
}

function ActionCard({ icon, title, description, href }: ActionCardProps) {
  return (
    <Link href={href}>
      <Box
        p={6}
        borderRadius="2xl"
        bg="white"
        boxShadow="sm"
        _hover={{
          boxShadow: "xl",
          transform: "translateY(-4px)",
        }}
        transition="all 0.2s"
        cursor="pointer"
      >
        <Flex direction="column" gap={4}>
          <Box
            bg="orange.50"
            w="fit-content"
            p={3}
            borderRadius="xl"
            color="orange.500"
          >
            <Icon as={icon} boxSize={6} />
          </Box>

          <Box>
            <Heading size="md">{title}</Heading>
            <Text color="gray.500" fontSize="sm">
              {description}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
}
function InfoItem({ label, value }: { label: string; value?: string }) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="semibold" textTransform="uppercase">
        {label}
      </Text>
      <Text>{value || "—"}</Text>
    </Box>
  );
}
