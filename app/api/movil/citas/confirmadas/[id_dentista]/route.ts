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
    const citasConfirmadas = await prisma.appointment.findMany({
      where: {
        doctor_id: Number(id_dentista),
        status: appointmentStatusList.STATUS_CONFIRMADA,
      },
      include: {
        patient: true,
      },
    });
    return NextResponse.json({ citas: citasConfirmadas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
