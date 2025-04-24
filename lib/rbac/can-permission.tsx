import { hasPermission } from "./permissions";
import ForbiddenAccess from "../../components/common/forbidden-access";
import { Session } from "next-auth";

export async function CanPermission({
  session,
  permission,
  children,
}: {
  session: Session | null;
  permission: string;
  children: React.ReactNode;
}) {
  if (!session) return null;
  if (!hasPermission(session.user.permissions, permission))
    return <ForbiddenAccess />;
  return <>{children}</>;
}
