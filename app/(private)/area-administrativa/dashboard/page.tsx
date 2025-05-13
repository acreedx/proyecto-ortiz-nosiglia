import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";

export default async function Page() {
  return (
    <CanStaff>
      <main>
        <BreadCrumb pageName="Panel de control" />
        <Heading>Dashboard</Heading>
      </main>
    </CanStaff>
  );
}
