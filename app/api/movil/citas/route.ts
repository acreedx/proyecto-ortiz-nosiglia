import { Appointment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";

export const dynamic = "force-dynamic";
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { appointment }: { appointment: Appointment } = await req.json();
    const validarFechaHora = await prisma.appointment.findMany({
      where: {
        programed_date_time: appointment.programed_date_time,
        programed_end_date_time: appointment.programed_end_date_time,
      },
    });
    if (validarFechaHora.length > 0) {
      return NextResponse.json(
        {
          error: "Ya existe una fecha en ese horario, por favor elija otro",
        },
        {
          status: 400,
        }
      );
    }
    await prisma.appointment.create({
      data: appointment,
    });
    return NextResponse.json({ message: "Cita creada con exito" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: NextRequest) {
  try {
    const citas = await prisma.appointment.findMany();
    return NextResponse.json({ citas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
