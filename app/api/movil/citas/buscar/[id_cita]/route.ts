import { prisma } from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { id_cita: string } },
) {
  const { id_cita } = params;
  try {
    const cita = await prisma.appointment.findFirst({
      where: {
        id: id_cita,
      },
      include: {
        subject: {
          include: {
            allergies: true,
          },
        },
      },
    });
    if (!cita) {
      return NextResponse.json(
        { message: "No existe esa cita" },
        { status: 500 },
      );
    }
    return NextResponse.json({ cita: cita });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
