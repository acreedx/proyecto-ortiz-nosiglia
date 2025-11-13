import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import OrganizationsTable from "./components/organizations-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";
import OrganizationClientButton from "./components/organizations-client-button";

export default async function Page() {
  const organizations = await prisma.organization.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Organizaciones" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Organizaciones</Heading>
          <OrganizationClientButton />
        </div>
        <OrganizationsTable props={{ organizations: organizations }} />
      </main>
    </CanStaff>
  );
}
