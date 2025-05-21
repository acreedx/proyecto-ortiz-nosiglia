import BreadCrumb from "../../../../components/admin/breadcrumb";
import PatientTable from "./components/patient-table";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
export default async function Page() {
  const pacientes = await prisma.user.findMany({
    where: {
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
    include: {
      role: true,
      patient: {
        include: {
          emergency_contact: true,
        },
      },
    },
  });
  const organizations = await prisma.organization.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Pacientes" />
        <Heading size="lg" mb={4}>
          Pacientes
        </Heading>
        <PatientTable
          props={{ pacientes: pacientes, organizations: organizations }}
        />
      </main>
    </CanStaff>
  );
}
