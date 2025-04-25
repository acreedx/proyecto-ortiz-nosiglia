import { SignIn } from "../../components/form/signinform";
import { SignOut } from "../../components/form/signoutbutton";
import { auth } from "../../lib/nextauth/auth";
import NavBar from "../../components/index/navbar";

export default async function Home() {
  const session = await auth();
  if (!session?.user)
    return (
      <>
        <SignIn />
      </>
    );
  return (
    <>
      <NavBar />
      <p>asdsd</p>
      <p className="text-white">username: {session.user.username}</p>
      <p>rol: {session.user.role}</p>
      permisos:{" "}
      {session.user.permissions.map((e, index) => {
        return (
          <p key={index}>
            {e.permission_name} - {e.code}
          </p>
        );
      })}
      <SignOut />
    </>
  );
}
