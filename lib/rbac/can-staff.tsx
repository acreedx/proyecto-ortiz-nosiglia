import React from "react";
import { auth } from "../nextauth/auth";
import { redirect } from "next/navigation";
import { rolesList } from "../nextauth/rolesList";
import ForbiddenAccess from "../../components/common/forbidden-access";

export default async function CanStaff({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/");
  if (session.user.role === rolesList.PACIENTE) return <ForbiddenAccess />;
  return <>{children}</>;
}
