import { auth } from "../../lib/nextauth/auth";
import { userStatusList } from "../../types/statusList";
import Sidebar from "./side-bar";
import { redirect } from "next/navigation";
export default async function SideBarSession() {
  const session = await auth();
  if (!session || !session.user) redirect("/login");
  if (session.user.status === userStatusList.NUEVO)
    redirect("/cambio-de-password");
  return <Sidebar session={session} />;
}
