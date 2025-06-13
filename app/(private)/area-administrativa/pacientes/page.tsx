import BreadCrumb from "../../../../components/admin/breadcrumb";
import PatientTable from "./components/patient-table";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import { Heading } from "@chakra-ui/react";
import CreateLargeDialog from "../../../../components/admin/dialog/create-large-dialog";
import PatientCreateForm from "./components/patient-create-form";
import { userStatusList } from "../../../../types/statusList";
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
  const activeOrganizations = organizations.filter(
    (e) => e.status === userStatusList.ACTIVO
  );
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Pacientes" />
        <div className="flex flex-row w-full items-center justify-between mb-2">
          <Heading>Pacientes</Heading>
          <CreateLargeDialog>
            <PatientCreateForm
              props={{
                organizations: activeOrganizations,
              }}
            />
          </CreateLargeDialog>
        </div>
        <PatientTable
          props={{ pacientes: pacientes, organizations: organizations }}
        />
      </main>
    </CanStaff>
  );
}
