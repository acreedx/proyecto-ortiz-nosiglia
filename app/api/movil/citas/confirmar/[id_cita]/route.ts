import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../../types/statusList";

export const dynamic = "force-dynamic";
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_cita: string } }
) {
  const { id_cita } = params;
  try {
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
        id: cita.id,
      },
      data: {
        status: appointmentStatusList.STATUS_CONFIRMADA,
      },
    });
    return NextResponse.json({ message: "Cita confirmada con exito" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
