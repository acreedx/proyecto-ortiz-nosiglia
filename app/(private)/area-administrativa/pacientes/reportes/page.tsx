import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";

export default function Page() {
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Reportes de pacientes" />
        <Heading size="lg" mb={4}>
          Reportes de pacientes
        </Heading>
        <div>
          <input type="search" placeholder="Buscar" />
          <input type="date" />
          <input type="date" />
        </div>
      </main>
    </CanStaff>
  );
}
