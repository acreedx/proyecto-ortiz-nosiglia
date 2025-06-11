"use server";

import fs from "fs/promises";
import path from "path";
export async function uploadFilesAction(files: File[]) {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const allowedExtensions = [".xls", ".xlsx", ".csv"];

  for (const file of files) {
    const ext = path.extname(file.name).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      console.log(`Archivo ignorado: ${file.name}`);
      continue;
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);
  }

  return { ok: true };
}
