import React from "react";
import { auth } from "../nextauth/auth";
import { redirect } from "next/navigation";
import { rolesList } from "../nextauth/rolesList";

export default async function CanStaff({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role === rolesList.PACIENTE)
    redirect("/acceso-no-autorizado");
  return <>{children}</>;
}
