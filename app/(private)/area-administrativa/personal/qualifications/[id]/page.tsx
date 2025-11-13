import React from "react";
import { Box, Heading, Icon, Link } from "@chakra-ui/react";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../../lib/nextauth/rolesList";
import { FaArrowCircleLeft } from "react-icons/fa";
import QualificationCard from "../../components/qualification-card";
import { Qualification } from "@prisma/client";
import StaffClientButton from "../../components/staff-client-button";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const doctor = await prisma.user.findUnique({
    where: {
      id: Number(id),
      role: {
        OR: [
          {
            role_name: rolesList.DENTISTA,
          },
          {
            role_name: rolesList.MEDICO_TEMPORAL,
          },
        ],
      },
    },
    include: {
      staff: {
        include: {
          doctor: {
            include: {
              qualification: true,
            },
          },
        },
      },
    },
  });
  if (!doctor || !doctor.staff || !doctor.staff.doctor) {
    return <div>No encontrado</div>;
  }
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <Link
          href="/area-administrativa/personal"
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
          pageName={`Títulos del Dentista ${doctor.first_name} ${doctor.last_name}`}
        />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>{`Títulos del Dentista ${doctor.first_name} ${doctor.last_name}`}</Heading>
          <StaffClientButton doctor_id={doctor.id} />
        </div>
        {doctor.staff.doctor.qualification.length > 0 ? (
          <Box as="section" mt={8}>
            <Heading size="md" mb={4} color={"orange"}>
              Títulos registrados
            </Heading>

            <QualificationCard
              qualifications={
                doctor.staff.doctor.qualification as Qualification[]
              }
            />
          </Box>
        ) : (
          <Heading size="md" mb={4} color={"orange"}>
            No hay títulos registrados
          </Heading>
        )}
      </main>
    </CanStaff>
  );
}
