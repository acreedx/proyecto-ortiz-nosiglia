import { prisma } from "@/config/prisma";
import { AppointmentStatus } from "@/enums/appointmentsStatus";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_dentista: string } },
) {
  try {
    const { id_dentista } = params;
    const citasCanceladas = await prisma.appointment.findMany({
      where: {
        practitionerId: id_dentista,
        status: AppointmentStatus.STATUS_CANCELADA,
        start: {
          gt: new Date(),
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
    return NextResponse.json({ citas: citasCanceladas });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
