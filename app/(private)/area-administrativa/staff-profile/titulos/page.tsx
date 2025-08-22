import React from "react";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Box, Heading } from "@chakra-ui/react";
import { prisma } from "../../../../../lib/prisma/prisma";
import { auth } from "../../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import QualificationsCreateForm from "../components/qualifications-create-form";
import CreateDialog from "../../../../../components/admin/dialog/create-dialog";
import QualificationCard from "../components/qualification-card";
import { Qualification } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === rolesList.PACIENTE)
    redirect("acceso-no-autorizado");
  const doctor = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
      role: {
        role_name: {
          in: [rolesList.DENTISTA, rolesList.MEDICO_TEMPORAL],
        },
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
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb pageName="Títulos" />
      <div className="flex flex-row w-full items-center justify-between">
        <Heading>{`Tus títulos`}</Heading>
        <CreateDialog>
          <QualificationsCreateForm doctor_id={doctor.id} />
        </CreateDialog>
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
  );
}
