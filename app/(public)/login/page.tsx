import { SignIn } from "../../../components/form/signinform";
import { SignOut } from "../../../components/form/signoutbutton";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        {!session ? (
          <SignIn />
        ) : (
          <div>
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
          </div>
        )}
      </div>
    </div>
  );
}
