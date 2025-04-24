import { redirect } from "next/navigation";
import ForbiddenAccess from "../../../components/common/forbidden-access";
import { auth } from "../../../lib/nextauth/auth";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/");
  if (session.user.role === "Administrador")
    return <div>Contenido Protegido Solo Para Administradores</div>;
  else return <ForbiddenAccess />;
}
