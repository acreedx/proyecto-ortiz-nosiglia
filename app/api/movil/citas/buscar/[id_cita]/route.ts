import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_cita: string }> }
): Promise<NextResponse> {
  const { id_cita } = await params;
  try {
    const cita = await prisma.appointment.findUnique({
      where: {
        id: Number(id_cita),
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!cita) {
      return NextResponse.json(
        { message: "No existe esa cita" },
        { status: 500 }
      );
    }
    return NextResponse.json({ cita: cita });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
