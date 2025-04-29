import { redirect } from "next/navigation";
import { SignIn } from "../../../components/form/signinform";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        {session ? redirect("logout") : <SignIn />}
      </div>
    </div>
  );
}
