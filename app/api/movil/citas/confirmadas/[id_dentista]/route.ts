import { NextRequest, NextResponse } from "next/server";
import { appointmentStatusList } from "../../../../../../types/statusList";
import { prisma } from "../../../../../../lib/prisma/prisma";

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
    const citasConfirmadas = await prisma.appointment.findMany({
      where: {
        doctor_id: usuario.staff.doctor.id,
        status: appointmentStatusList.STATUS_CONFIRMADA,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    return NextResponse.json({ citas: citasConfirmadas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
