import BreadCrumb from "../../../../components/admin/breadcrumb";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import { userStatusList } from "../../../../types/statusList";
import ClientSection from "./components/clientSection";
export default async function Page() {
  const organizations = await prisma.organization.findMany();
  const activeOrganizations = organizations.filter(
    (e) => e.status === userStatusList.ACTIVO
  );
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Pacientes" />
        <ClientSection
          props={{
            organizations: organizations,
            activeOrganizations: activeOrganizations,
          }}
        />
      </main>
    </CanStaff>
  );
}
