import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { id_paciente: string } }
) {
  const { id_paciente } = params;

  try {
    const paciente = await prisma.user.findFirst({
      where: {
        id: Number(id_paciente),
        role: {
          role_name: rolesList.PACIENTE,
        },
      },
      include: {
        patient: true,
      },
    });
    if (!paciente) {
      return NextResponse.json(
        { error: "No existe ese paciente" },
        { status: 500 }
      );
    }
    return NextResponse.json({ paciente });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
