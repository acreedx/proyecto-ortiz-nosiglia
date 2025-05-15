import { NextRequest, NextResponse } from "next/server";
import {
  AppointmentSpecialty,
  AppointmentStatus,
} from "@/enums/appointmentsStatus";
import { prisma } from "@/config/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { descripcion, fecha, hora, doctor, usuarioId } = await req.json();
    if (!descripcion || !fecha || !hora || !doctor || !usuarioId) {
      return NextResponse.json(
        { error: "Faltan datos requeridos." },
        { status: 400 },
      );
    }
    const [day, month, year] = fecha.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    let [hour, minute] = hora.split(":");
    let period = hora.split(" ")[1];
    if (period === "PM" && hour !== "12") {
      hour = parseInt(hour) + 12;
    }

    if (period === "AM" && hour === "12") {
      hour = "00";
    }
    hour = parseInt(hour) + 4;
    if (hour >= 24) {
      hour = hour - 24;
    }
    const formattedTime = `${String(hour).padStart(2, "0")}:${String(minute).slice(0, 2)}`;
    const start = new Date(`${formattedDate}T${formattedTime}:00`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const now = new Date();
    if (start <= now) {
      return NextResponse.json(
        {
          error:
            "La fecha de la cita debe ser mayor a la fecha y hora actuales.",
        },
        { status: 400 },
      );
    }
    const citaExistente = await prisma.appointment.findFirst({
      where: {
        practitionerId: doctor,
        AND: [
          {
            OR: [
              { start: { lte: start }, end: { gt: start } },
              { start: { lt: end }, end: { gte: end } },
              { start: { gte: start }, end: { lte: end } },
            ],
          },
        ],
      },
    });

    if (citaExistente) {
      return NextResponse.json(
        { error: "Ya hay una cita en ese horario para este doctor." },
        { status: 400 },
      );
    }
    const citaExistentePaciente = await prisma.appointment.findFirst({
      where: {
        subjectId: usuarioId,
        AND: [
          {
            OR: [
              { start: { lte: start }, end: { gt: start } },
              { start: { lt: end }, end: { gte: end } },
              { start: { gte: start }, end: { lte: end } },
            ],
          },
        ],
      },
    });

    if (citaExistentePaciente) {
      return NextResponse.json(
        { error: "Ya tienes una cita reservada en ese horario." },
        { status: 400 },
      );
    }

    await prisma.appointment.create({
      data: {
        start: start,
        end: end,
        specialty: AppointmentSpecialty.ESPECIALIDAD_CONTINUA,
        reason: descripcion,
        subjectId: usuarioId,
        practitionerId: doctor,
        status: AppointmentStatus.STATUS_PENDIENTE,
      },
    });

    return NextResponse.json({ message: "Cita creada con exito." });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Error al crear la cita." },
      { status: 500 },
    );
  }
}
