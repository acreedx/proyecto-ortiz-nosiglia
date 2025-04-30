import CreatePatientForm from "../../../components/form/create-patient-form";
import Banner from "../../../components/index/banner";
import { auth } from "../../../lib/nextauth/auth";

export default async function Page() {
  const session = await auth();
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-100 flex items-center justify-center">
          <div className="text-center w-full px-8">
            {session ? (
              <>
                <h1 className="text-red-600 text-2xl font-bold">
                  Ya has iniciado sesión
                </h1>
                <p className="text-gray-700 mt-4 text-lg">
                  Ya puedes navegar por el sitio
                </p>
              </>
            ) : (
              <>
                <h1 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
                  Crear cuenta nueva
                </h1>
                <CreatePatientForm />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
