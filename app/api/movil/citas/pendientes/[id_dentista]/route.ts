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
    const citasPendientes = await prisma.appointment.findMany({
      where: {
        practitionerId: id_dentista,
        status: AppointmentStatus.STATUS_PENDIENTE,
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
    return NextResponse.json({ citas: citasPendientes });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
