import { auth } from "../../lib/nextauth/auth";
import Sidebar from "./side-bar";
import { redirect } from "next/navigation";
export default async function SideBarSession() {
  const session = await auth();
  if (!session) redirect("/login");
  return <Sidebar session={session} />;
}
