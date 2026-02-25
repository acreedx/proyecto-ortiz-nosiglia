import React from "react";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../../lib/nextauth/rolesList";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import { Heading, Icon, Link } from "@chakra-ui/react";
import { FaArrowCircleLeft } from "react-icons/fa";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import PacienteDashboard from "./paciente-dashboard";

export default async function InformacionPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const paciente = await prisma.user.findUnique({
    where: {
      id: Number(id),
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
    include: {
      patient: {
        include: {
          odontogram: {
            include: {
              odontogram_row: true,
            },
          },
        },
      },
    },
  });
  if (!paciente) {
    return <div>No encontrado</div>;
  }
  if (!paciente.patient) {
    return <div>No encontrado</div>;
  }
  if (!paciente.patient.odontogram) {
    return <div>No encontrado</div>;
  }
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
        <BreadCrumb pageName={`${paciente.first_name} ${paciente.last_name}`} />
        <Heading className="my-4">Panel clínico del paciente</Heading>
        <PacienteDashboard paciente={paciente} />
      </main>
    </CanStaff>
  );
}
