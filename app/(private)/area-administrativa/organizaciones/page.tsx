import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import { Heading } from "@chakra-ui/react";
import OrganizationsCreateForm from "./components/organizations-create-form";
import OrganizationsTable from "./components/organizations-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  const organizations = await prisma.organization.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Organizaciones" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Organizaciones</Heading>
          <CreateDialog>
            <OrganizationsCreateForm />
          </CreateDialog>
        </div>
        <OrganizationsTable props={{ organizations: organizations }} />
      </main>
    </CanStaff>
  );
}
