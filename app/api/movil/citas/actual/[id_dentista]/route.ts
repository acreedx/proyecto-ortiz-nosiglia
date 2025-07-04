import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_dentista: string }> }
): Promise<NextResponse> {
  try {
    const { id_dentista } = await params;
    const citasActivas = await prisma.appointment.findMany({
      where: {
        doctor_id: Number(id_dentista),
        programed_date_time: {
          lte: new Date(),
        },
        programed_end_date_time: {
          gte: new Date(),
        },
      },
      include: {
        patient: {
          include: {
            user: true,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
