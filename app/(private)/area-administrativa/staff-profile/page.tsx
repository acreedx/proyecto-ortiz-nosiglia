import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import { prisma } from "../../../../lib/prisma/prisma";
import { auth } from "../../../../lib/nextauth/auth";
import EditProfileForm from "../../../../components/admin/forms/staff-edit-profile-form";
import { User } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  if (!session) return null;
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
  });
  return (
    <div>
      <BreadCrumb pageName="Perfil" />
      <Heading>Editar tu perfil</Heading>
      <EditProfileForm user={user as User} />
    </div>
  );
}
