import React from "react";
import { auth } from "../../../lib/nextauth/auth";
import { SignOut } from "../../../components/form/signoutbutton";
import { redirect } from "next/navigation";
import Banner from "../../../components/index/banner";

export default async function Page() {
  const session = await auth();
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default ">
      <div className="flex flex-wrap items-center ">
        <Banner />
        {!session ? (
          redirect("/login")
        ) : (
          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
                ¡Bienvenido de nuevo{" "}
                {`${session.user.first_name} ${session.user.last_name}`}!
              </h2>
              <div>
                <p>username: {session.user.username}</p>
                <p>rol: {session.user.role}</p>
                permisos:{" "}
                {session.user.permissions.map((e, index) => {
                  return (
                    <p key={index}>
                      {e.permission_name} - {e.code}
                    </p>
                  );
                })}
              </div>
              <SignOut />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
