import { prisma } from "@/config/prisma";
import { Appointment } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const { appointment }: { appointment: Appointment } = await req.json();
    const validarFechaHora = await prisma.appointment.findMany({
      where: {
        start: appointment.start,
        end: appointment.end,
      },
    });
    if (validarFechaHora.length > 0) {
      return NextResponse.json(
        {
          error: "Ya existe una fecha en ese horario, por favor elija otro",
        },
        {
          status: 400,
        },
      );
    }
    await prisma.appointment.create({
      data: appointment,
    });
    return NextResponse.json({ message: "Cita creada con exito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const citas = await prisma.appointment.findMany();
    return NextResponse.json({ citas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
