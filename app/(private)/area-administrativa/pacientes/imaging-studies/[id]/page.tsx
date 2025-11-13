import React from "react";
import { Heading, Icon, Link } from "@chakra-ui/react";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../../lib/nextauth/rolesList";
import { FaArrowCircleLeft } from "react-icons/fa";
import ImagingStudies from "../../components/imaging-studies";
import PatientClientButton from "../../components/patient-client-button";

export default async function Page({
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
          imaging_study: {
            include: {
              files: true,
            },
          },
        },
      },
    },
  });
  if (!paciente || !paciente.patient) {
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
        <BreadCrumb
          pageName={`Radiografías de ${paciente.first_name} ${paciente.last_name}`}
        />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>{`Radiografías de ${paciente.first_name} ${paciente.last_name}`}</Heading>

          <PatientClientButton patientId={Number(id)} />
        </div>
        <section>
          <ImagingStudies studies={paciente.patient.imaging_study} />
        </section>
      </main>
    </CanStaff>
  );
}
