import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../../types/statusList";

export const dynamic = "force-dynamic";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_cita: string }> }
): Promise<NextResponse> {
  const { id_cita } = await params;
  try {
    const { cancellation_reason } = await req.json();
    const cita = await prisma.appointment.findFirst({
      where: {
        id: Number(id_cita),
      },
    });
    if (!cita) {
      return NextResponse.json(
        { error: "No existe esa cita" },
        { status: 500 }
      );
    }
    await prisma.appointment.update({
      where: {
        id: Number(id_cita),
      },
      data: {
        status: appointmentStatusList.STATUS_CANCELADA,
        is_cancelled: true,
        cancellation_date: new Date(),
        cancellation_reason: cancellation_reason,
      },
    });
    return NextResponse.json({ message: "Cita cancelada con exito" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
