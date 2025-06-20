import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../../types/statusList";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_dentista: string }> }
): Promise<NextResponse> {
  try {
    const { id_dentista } = await params;
    const usuario = await prisma.user.findUnique({
      where: {
        id: Number(id_dentista),
      },
      include: {
        staff: {
          include: {
            doctor: true,
          },
        },
      },
    });
    if (!usuario || !usuario.staff || !usuario.staff.doctor) {
      return NextResponse.json(
        { message: "Usuario no encontrado" },
        { status: 500 }
      );
    }
    const citasCanceladas = await prisma.appointment.findMany({
      where: {
        doctor_id: usuario.staff.doctor.id,
        status: appointmentStatusList.STATUS_CANCELADA,
      },
      include: {
        patient: true,
      },
    });
    return NextResponse.json({ citas: citasCanceladas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
