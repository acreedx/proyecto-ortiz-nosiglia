import { Heading } from "@chakra-ui/react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import DropZone from "../deudas/components/drop-zone";
import CanStaff from "../../../../lib/rbac/can-staff";

export default function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Subir datos en formato excel" />
        <Heading>Importar datos en formato excel</Heading>
        <DropZone />
      </main>
    </CanStaff>
  );
}
