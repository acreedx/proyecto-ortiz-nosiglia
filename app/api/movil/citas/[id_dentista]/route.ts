import { prisma } from "@/config/prisma";
import { Appointment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: { id_dentista: string } },
) {
  try {
    const { id_dentista } = params;
    const citas = await prisma.appointment.findMany({
      where: {
        practitionerId: id_dentista,
      },
    });
    return NextResponse.json({ citas });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
