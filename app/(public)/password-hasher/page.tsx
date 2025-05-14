"use client";
import React, { FormEvent } from "react";
import { hashPassword } from "../../../lib/bcrypt/hasher";
import { mostrarAlertaExito } from "../../../lib/sweetalert/alerts";
import generateStrongPassword from "../../../lib/bcrypt/password-generator";

export default function Page() {
  //todo eliminar esta página en producción
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const values = Object.fromEntries(formData.entries());
    const hashed = await hashPassword(values.texto.toString());
    mostrarAlertaExito({
      mensaje: "La contraseña hasheada es " + hashed,
    });
  };
  return (
    <main className="flex flex-row flex-grow h-full justify-center items-center gap-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="texto" placeholder="Ingresa la contraseña" type="text" />
        <button type="submit" className="bg-orange-200">
          Hashear
        </button>
      </form>
      <button
        onClick={() => {
          const password = generateStrongPassword();
          mostrarAlertaExito({
            mensaje:
              "Contraseña generada: " +
              password +
              ` con ${password.length} carácteres `,
          });
        }}
        className="bg-graydark text-white p-2"
      >
        Generar contraseña aleatoria
      </button>
    </main>
  );
}
