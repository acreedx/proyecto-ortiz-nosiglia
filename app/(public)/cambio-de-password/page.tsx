import React from "react";
import Banner from "../../../components/index/banner";
import ChangePasswordForm from "../../../components/form/change-password-form";
import { auth } from "../../../lib/nextauth/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  return (
    <main className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex items-center justify-center">
          <div className="text-center w-full px-8 py-4">
            <h1 className="mb-8 text-2xl font-bold text-black sm:text-title-lg">
              Cambio de contraseña
            </h1>
            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </main>
  );
}
