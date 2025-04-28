import { auth } from "../../lib/nextauth/auth";
import NavBar from "./nav-bar";

export default async function NavBarSession() {
  const session = await auth();
  return <NavBar session={session} />;
}
