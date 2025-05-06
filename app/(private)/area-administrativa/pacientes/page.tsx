import BreadCrumb from "../../../../components/admin/breadcrumb";
import PatientTable from "../../../../components/admin/tables/patient-table";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { prisma } from "../../../../lib/prisma/prisma";
export default async function Page() {
  const pacientes = await prisma.user.findMany({
    where: {
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
    include: {
      role: true,
    },
  });
  console.log(pacientes);
  return (
    <div className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb pageName="Pacientes" />
      <PatientTable pacientes={pacientes} />
    </div>
  );
}
