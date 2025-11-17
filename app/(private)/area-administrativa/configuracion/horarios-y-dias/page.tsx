import React from "react";
import CanStaff from "../../../../../lib/rbac/can-staff";
import BreadCrumb from "../../../../../components/admin/breadcrumb";
import { prisma } from "../../../../../lib/prisma/prisma";
import CreateButton from "../components/create-button";
import EditConfigurationForm from "../components/editconfigurationform";

export default async function Page() {
  const configuraciones = await prisma.configuration.findFirst();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Configuración de horarios y días de atención" />
        {configuraciones ? (
          <EditConfigurationForm configuraciones={configuraciones} />
        ) : (
          <div className="mt-4">
            <p> No se encontraron configuraciones activas</p>
            <CreateButton />
          </div>
        )}
      </main>
    </CanStaff>
  );
}
