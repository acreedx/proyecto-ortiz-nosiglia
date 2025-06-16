import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma/prisma";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_dentista: number }> }
): Promise<NextResponse> {
  try {
    const { id_dentista } = await params;
    const citas = await prisma.appointment.findMany({
      where: {
        doctor_id: id_dentista,
      },
    });
    return NextResponse.json({ citas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
