import React from "react";
import { Heading, Link } from "@chakra-ui/react";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../../lib/nextauth/rolesList";

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
          imaging_study: true,
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
          pageName={`Radiografías de ${paciente.first_name} ${paciente.last_name}`}
        />
        <Heading>{`Radiografías de ${paciente.first_name} ${paciente.last_name}`}</Heading>
        <Link
          href="/area-administrativa/pacientes"
          colorPalette={"orange"}
          w={"fit-content"}
        >
          Volver
        </Link>
      </main>
    </CanStaff>
  );
}
