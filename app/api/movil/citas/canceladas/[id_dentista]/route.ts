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
    const citasCanceladas = await prisma.appointment.findMany({
      where: {
        doctor_id: Number(id_dentista),
        status: appointmentStatusList.STATUS_CANCELADA,
        programed_date_time: {
          gt: new Date(),
        },
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
