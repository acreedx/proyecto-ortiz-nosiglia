"use client";
import React, { FormEvent, useRef, useState } from "react";
import { hashPassword } from "../../../lib/bcrypt/hasher";
import { mostrarAlertaExito } from "../../../lib/sweetalert/alerts";
import generateStrongPassword from "../../../lib/bcrypt/password-generator";
import { FileUpload, Button, Field } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { uploadFilesAction } from "./test-actions";

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

  const [status, setStatus] = useState("");
  const [loading, setloading] = useState(false);
  const validExcelFiles = useRef<File[]>([]);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    const files = Array.from(fileList);
    const excelFiles = files.filter((file) =>
      /\.(xlsx|xls|csv)$/i.test(file.name)
    );
    validExcelFiles.current = excelFiles;
  };
  const BATCH_SIZE = 10;

  const chunkArray = (arr: File[], size: number): File[][] => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };
  const handleSubmitFiles = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validExcelFiles.current.length === 0) {
      setStatus("No hay archivos Excel válidos para subir.");
      return;
    }
    const files = validExcelFiles.current;
    const fileChunks = chunkArray(files, BATCH_SIZE);

    setloading(true);
    for (let i = 0; i < fileChunks.length; i++) {
      const chunk = fileChunks[i];
      const files: File[] = [];
      chunk.forEach((file) => {
        files.push(file);
      });
      const result = await uploadFilesAction(files);
      if (!result.ok) {
        setStatus(`Error al subir archivos en el batch ${(i + 1) * 10}`);
        return;
      } else {
        setStatus(
          `Subiendo los datos a la base de datos ${(i + 1) * 10} de ${validExcelFiles.current.length}`
        );
      }
    }
    setloading(false);
    setStatus(
      `Todos los ${validExcelFiles.current.length} archivos se subieron correctamente.`
    );
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
      <div>
        <form onSubmit={handleSubmitFiles}>
          <Field.Root>
            <FileUpload.Root directory>
              <FileUpload.HiddenInput
                multiple
                onChange={(e) => handleFiles(e.target.files)}
                name="files"
              />
              <FileUpload.Trigger asChild>
                <Button variant="outline" size="sm">
                  <HiUpload /> Upload file
                </Button>
              </FileUpload.Trigger>
              <FileUpload.List />
            </FileUpload.Root>
          </Field.Root>
          <Button
            type="submit"
            disabled={loading}
            mt={2}
            colorPalette={"orange"}
          >
            Subir carpeta
          </Button>
        </form>
        {status && <p className="mt-4">{status}</p>}
      </div>
    </main>
  );
}
