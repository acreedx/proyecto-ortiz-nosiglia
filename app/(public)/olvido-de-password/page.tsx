import { Link } from "@chakra-ui/react";
import ForgotPasswordForm from "../../../components/form/forgot-password-form";
import Banner from "../../../components/index/banner";

export default function Page() {
  return (
    <main className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex items-center justify-center">
          <div className="text-center w-full px-8 py-4">
            <h1 className="mb-8 text-2xl font-bold text-black sm:text-title-lg">
              Olvidaste tu contraseña?
            </h1>
            <ForgotPasswordForm />
            <div className="mt-6 text-center">
              <p className="text-black">
                No tienes una cuenta?{" "}
                <Link
                  href={"/crear-cuenta"}
                  className="text-orange-400 hover:text-orange-500"
                >
                  Registrate
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
