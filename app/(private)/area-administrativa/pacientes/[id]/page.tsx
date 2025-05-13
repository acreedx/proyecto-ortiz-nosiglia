import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { prisma } from "../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import { userStatusList } from "../../../../../types/statusList";
import PatientOdontogram from "../components/patient-odontogram";
import { Heading, Link } from "@chakra-ui/react";

export default async function Page({
  params,
}: {
  params: {
    id: string;
  };
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
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb
          pageName={`Odontograma de ${paciente.first_name} ${paciente.last_name}`}
        />
        <Heading>{`Odontograma de ${paciente.first_name} ${paciente.last_name}`}</Heading>
        <Link href="/area-administrativa/pacientes" colorPalette={"orange"}>
          Volver
        </Link>
        <PatientOdontogram
          props={{
            odontogramRows: paciente.patient?.odontogram?.odontogram_row,
          }}
        />
      </main>
    </CanStaff>
  );
}
