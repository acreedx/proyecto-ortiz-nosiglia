import { redirect } from "next/navigation";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";
import EditProfileForm from "../../../components/form/edit-profile-form";
import { prisma } from "../../../lib/prisma/prisma";
import { User } from "@prisma/client";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
  });
  return (
    <main>
      <div className="rounded-sm border border-stroke bg-white shadow-default ">
        <div className="flex flex-wrap items-center ">
          <Banner />
          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex items-center justify-center">
            <div className="text-center w-full px-8 py-4">
              <h1 className="text-red-600 text-2xl font-bold">Editar perfil</h1>
              <EditProfileForm user={user as User} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
