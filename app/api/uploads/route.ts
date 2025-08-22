import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const isValid = formData.get("isValid") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No se recibió archivo" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // destino según la validación
    const destino = path.join(
      process.cwd(),
      "uploads",
      isValid === "true" ? "validos" : "invalidos",
      file.name
    );

    await fs.mkdir(path.dirname(destino), { recursive: true });
    await fs.writeFile(destino, buffer);

    return NextResponse.json({
      ok: true,
      destino: destino.replace(process.cwd(), ""),
    });
  } catch (error) {
    console.error("Error subiendo archivo:", error);
    return NextResponse.json(
      { error: "Error al procesar archivo" },
      { status: 500 }
    );
  }
}
