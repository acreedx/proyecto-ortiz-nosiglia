import { Link } from "@chakra-ui/react";
import CreatePatientForm from "../../../components/form/create-patient-form";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";
import { prisma } from "../../../lib/prisma/prisma";
import { userStatusList } from "../../../types/statusList";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  const organizations = await prisma.organization.findMany({
    where: {
      status: userStatusList.ACTIVO,
    },
  });
  return (
    <main className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex items-center justify-center">
          <div className="text-center w-full px-8 py-4">
            {!session || !session.user ? (
              <>
                <h1 className="mb-4 text-2xl font-bold text-black sm:text-title-xl2">
                  Crear cuenta nueva
                </h1>
                <CreatePatientForm organizations={organizations} />
                <div className="mt-4 text-center">
                  <p className="text-black">
                    Ya tienes una cuenta?{" "}
                    <Link
                      href={"/login"}
                      className="text-orange-400 hover:text-orange-500"
                    >
                      Iniciar sesión
                    </Link>
                  </p>
                </div>
              </>
            ) : session.user.status === userStatusList.NUEVO ? (
              redirect("/cambio-de-password")
            ) : (
              <>
                <h1 className="text-red-600 text-2xl font-bold">
                  Ya has iniciado sesión
                </h1>
                <p className="text-gray-700 mt-4 text-lg">
                  Ya puedes navegar por el sitio
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
