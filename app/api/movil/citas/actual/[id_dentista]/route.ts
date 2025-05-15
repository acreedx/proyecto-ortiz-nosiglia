import { prisma } from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_dentista: string } },
) {
  try {
    const { id_dentista } = params;
    const citasActivas = await prisma.appointment.findMany({
      where: {
        practitionerId: id_dentista,
        start: {
          lte: new Date(),
        },
        end: {
          gte: new Date(),
        },
      },
      include: {
        subject: {
          include: {
            allergies: true,
          },
        },
      },
    });

    if (citasActivas.length > 0) {
      return NextResponse.json({ cita: citasActivas[0] });
    } else {
      return NextResponse.json({
        message: "No hay citas activas en este momento.",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
