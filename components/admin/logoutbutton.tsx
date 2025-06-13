"use client";
import React from "react";
import { LuLogOut } from "react-icons/lu";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import { signOut } from "next-auth/react";

export default function LogOutButton() {
  const handleLogOut = async () => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de cerrar sesión?",
    });
    if (isConfirmed) {
      await signOut();
    }
  };
  return (
    <button
      onClick={handleLogOut}
      className="flex items-center gap-3.5 text-sm font-medium duration-150 ease-in-out hover:text-orange-500 lg:text-base cursor-pointer"
    >
      <LuLogOut />
      Cerrar sesión
    </button>
  );
}
