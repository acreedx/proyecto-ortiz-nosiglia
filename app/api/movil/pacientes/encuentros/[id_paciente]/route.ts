import { prisma } from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { id_paciente: string } },
) {
  const { id_paciente } = params;
  try {
    const paciente = await prisma.patient.findUnique({
      where: {
        id: id_paciente,
      },
      include: {
        encounters: true,
      },
    });
    return NextResponse.json({ paciente: paciente });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
