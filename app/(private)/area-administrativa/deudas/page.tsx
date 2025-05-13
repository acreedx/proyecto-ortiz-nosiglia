import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CreateDialog from "../../../../components/admin/dialog/create-dialog";
import DebtsTable from "./components/debts-table";
import { prisma } from "../../../../lib/prisma/prisma";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  const accounts = await prisma.account.findMany();
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Deudas" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Panel de deudas</Heading>
          <CreateDialog>
            <div>Create</div>
          </CreateDialog>
        </div>
        <DebtsTable props={{ accounts: accounts }} />
      </main>
    </CanStaff>
  );
}
