"use client";
import {
  Box,
  SimpleGrid,
  Text,
  Grid,
  IconButton,
  useDialog,
} from "@chakra-ui/react";
import { Organization, Prisma } from "@prisma/client";
import Image from "next/image";
import React, { useRef } from "react";
import {
  FaTooth,
  FaXRay,
  FaFileMedical,
  FaCalendarAlt,
  FaEdit,
} from "react-icons/fa";
import ActionCard, {
  ActionCardProps,
} from "../../../../../../components/admin/action-card";
import InfoItem, {
  InfoItemProps,
} from "../../../../../../components/admin/info-item";
import { Tooltip } from "../../../../../../components/ui/tooltip";
import { LuSiren } from "react-icons/lu";
import EditPatientForm from "../../components/patient-edit-form";
import { dialog } from "../../../../../../providers/DialogProvider";
import { GridApi, IDatasource } from "ag-grid-community";
import EmergencyContactEditForm from "../../components/emergency-contact-edit-form";

function PacienteDashboard({
  paciente,
  organizations,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activeOrganizations,
}: {
  paciente: Prisma.UserGetPayload<{
    include: {
      patient: {
        include: {
          emergency_contact: true;
        };
      };
    };
  }>;
  organizations: Organization[];
  activeOrganizations: Organization[];
}) {
  const infoItemProps: InfoItemProps[] = [
    {
      label: "Teléfono",
      value: paciente.phone,
    },
    {
      label: "Email",
      value: paciente.email,
    },
    {
      label: "Fecha de nacimiento",
      value: paciente.birth_date
        ? new Date(paciente.birth_date).toLocaleDateString()
        : "—",
    },
    {
      label: "Celular",
      value: paciente.mobile,
    },
    {
      label: "Teléfono",
      value: paciente.phone,
    },
    {
      label: "CI",
      value: paciente.identification,
    },
  ];
  const actionCards: ActionCardProps[] = [
    {
      icon: FaTooth,
      title: "Odontograma",
      description: "Visualiza y edita el estado dental",
      href: `/area-administrativa/pacientes/odontograma/${paciente.id}`,
    },
    {
      icon: FaXRay,
      title: "Radiografías",
      description: "Consulta estudios radiológicos",
      href: `/area-administrativa/pacientes/imaging-studies/${paciente.id}`,
    },
    {
      icon: FaFileMedical,
      title: "Historial Clínico",
      description: "Visualiza y edita el estado dental",
      href: `/area-administrativa/pacientes/historial/${paciente.id}`,
    },
    {
      icon: FaCalendarAlt,
      title: "Citas",
      description: "Agenda y consultas programadas",
      href: `/area-administrativa/pacientes/${paciente.id}/citas`,
    },
  ];
  const editDialog = useDialog();
  const emergencyContactDialog = useDialog();
  const gridApiRef = useRef<GridApi | null>(null);
  const datasourceRef = useRef<IDatasource | null>(null);
  return (
    <div className="flex flex-col gap-4">
      <Box
        p={6}
        bg="white"
        borderRadius="2xl"
        boxShadow="sm"
        className="dark:bg-boxdark"
      >
        <Grid
          templateColumns={{ base: "1fr", md: "300px 1fr" }}
          gap={8}
          alignItems="center"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-center">
              <Image
                alt={`${paciente.first_name}`}
                src={`${paciente.photo_url}`}
                width={80}
                height={80}
                className="h-[80px] rounded-full shadow-lg border border-black"
              />
            </div>
            <Box>
              <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
                Nombre
              </Text>
              <Text>
                {paciente.first_name} {paciente.last_name}
              </Text>
            </Box>
          </div>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gapX={10} gapY={4}>
            {infoItemProps.map((e, index) => {
              return <InfoItem key={index} label={e.label} value={e.value} />;
            })}
          </SimpleGrid>
        </Grid>
        <div className="flex w-full justify-end items-center">
          <Tooltip content="Editar paciente">
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Editar paciente"
              mr={2}
              onClick={() => {
                dialog.open("Edit Dialog", {
                  content: (
                    <EditPatientForm
                      props={{
                        patient: paciente.patient!,
                        organizations: organizations,
                        dialog: editDialog,
                        gridApiRef: gridApiRef,
                        datasourceRef: datasourceRef,
                      }}
                    />
                  ),
                });
              }}
            >
              <FaEdit color="orange" />
            </IconButton>
          </Tooltip>
          <Tooltip content="Contacto de emergencia">
            <IconButton
              size="sm"
              colorPalette="orange"
              variant="outline"
              aria-label="Contacto de emergencia"
              mr={2}
              onClick={() => {
                dialog.open("Contact Dialog", {
                  content: (
                    <EmergencyContactEditForm
                      props={{
                        patient: paciente.patient!,
                        dialog: emergencyContactDialog,
                        gridApiRef: gridApiRef,
                        datasourceRef: datasourceRef,
                      }}
                    />
                  ),
                  size: "md",
                });
              }}
            >
              <LuSiren color="red" />
            </IconButton>
          </Tooltip>
        </div>
      </Box>
      <Box>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {actionCards.map((e, index) => {
            return (
              <ActionCard
                key={index}
                icon={e.icon}
                title={e.title}
                description={e.description}
                href={e.href}
              />
            );
          })}
        </SimpleGrid>
      </Box>
    </div>
  );
}

export default PacienteDashboard;
