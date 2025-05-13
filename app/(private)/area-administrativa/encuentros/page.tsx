import { Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../components/admin/breadcrumb";

export default async function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Encuentros" />
        <Heading>Encuentros</Heading>
      </main>
    </CanStaff>
  );
}
