import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../../types/statusList";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id_dentista: string } }
) {
  try {
    const { id_dentista } = params;
    const citasHistorial = await prisma.appointment.findMany({
      where: {
        doctor_id: Number(id_dentista),
        OR: [
          { status: appointmentStatusList.STATUS_COMPLETADA },
          { programed_date_time: { lt: new Date() } },
        ],
      },
      include: {
        patient: true,
      },
    });
    return NextResponse.json({ citas: citasHistorial });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
