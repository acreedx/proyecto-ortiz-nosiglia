import { redirect } from "next/navigation";
import { SignIn } from "../../../components/form/signinform";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";
import { userStatusList } from "../../../types/statusList";

export default async function Home() {
  const session = await auth();
  return (
    <main className="rounded-sm border border-stroke bg-white shadow-default flex-grow">
      <div className="flex flex-wrap items-center ">
        <Banner />
        {!session ? (
          <SignIn />
        ) : !session.user ? (
          redirect("logout")
        ) : session.user.status === userStatusList.NUEVO ? (
          redirect("/cambio-de-password")
        ) : (
          redirect("logout")
        )}
      </div>
    </main>
  );
}
