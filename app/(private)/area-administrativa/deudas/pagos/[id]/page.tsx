import React from "react";
import CanStaff from "../../../../../../lib/rbac/can-staff";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { Icon, Heading, Link } from "@chakra-ui/react";
import { FaArrowCircleLeft } from "react-icons/fa";
import BreadCrumb from "../../../../../../components/admin/breadcrumb";
import InvoicesTable from "../../components/invoices-table";

export default async function Page({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      patient: {
        include: {
          account: {
            include: {
              invoice: true,
            },
          },
        },
      },
    },
  });
  if (!user || !user.patient) return <div>No encontrado</div>;
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <Link
          href="/area-administrativa/deudas"
          colorPalette={"orange"}
          w={"fit-content"}
          mb={2}
        >
          <Icon>
            <FaArrowCircleLeft />
          </Icon>
          Volver
        </Link>
        <BreadCrumb
          pageName={`Recibos de ${user.first_name} ${user.last_name}`}
        />
        <Heading>{`Recibos de ${user.first_name} ${user.last_name}`}</Heading>
        <InvoicesTable
          props={{
            invoices: user.patient.account.invoice,
            accountId: Number(id),
          }}
        />
      </main>
    </CanStaff>
  );
}
