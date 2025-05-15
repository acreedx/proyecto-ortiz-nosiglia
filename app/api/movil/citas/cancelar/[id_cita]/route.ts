import { prisma } from "@/config/prisma";
import { AppointmentStatus } from "@/enums/appointmentsStatus";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
const STATUS_TEXT = "canceled";
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_cita: string } },
) {
  const { id_cita } = params;
  try {
    const cita = await prisma.appointment.findFirst({
      where: {
        id: id_cita,
      },
    });
    if (!cita) {
      return NextResponse.json(
        { error: "No existe esa cita" },
        { status: 500 },
      );
    }
    await prisma.appointment.update({
      where: {
        id: id_cita,
      },
      data: {
        status: AppointmentStatus.STATUS_CANCELADA,
      },
    });
    return NextResponse.json({ message: "Cita cancelada con exito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
