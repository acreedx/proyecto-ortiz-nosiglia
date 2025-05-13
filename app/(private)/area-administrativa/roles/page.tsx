import React from "react";
import { prisma } from "../../../../lib/prisma/prisma";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import RolesTable from "./components/roles-table";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  const roles = await prisma.role.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Roles" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Roles</Heading>
          <CreateDialog>
            <div>Create</div>
          </CreateDialog>
        </div>
        <RolesTable
          props={{
            roles: roles,
          }}
        />
      </main>
    </CanStaff>
  );
}
