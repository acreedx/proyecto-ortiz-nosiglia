import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../types/statusList";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const { descripcion, fecha, hora, doctor, patient_id } = await req.json();
    if (!descripcion || !fecha || !hora || !doctor || !patient_id) {
      return NextResponse.json(
        { error: "Faltan datos requeridos." },
        { status: 400 }
      );
    }
    const [day, month, year] = fecha.split("/");
    const formattedDate = `${year}-${month}-${day}`;
    // eslint-disable-next-line prefer-const
    let [hour, minute] = hora.split(":");
    const period = hora.split(" ")[1];
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
        { status: 400 }
      );
    }
    const citaExistente = await prisma.appointment.findFirst({
      where: {
        doctor_id: doctor,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: start },
                programed_end_date_time: { gt: start },
              },
              {
                programed_date_time: { lt: end },
                programed_end_date_time: { gte: end },
              },
              {
                programed_date_time: { gte: start },
                programed_end_date_time: { lte: end },
              },
            ],
          },
        ],
      },
    });

    if (citaExistente) {
      return NextResponse.json(
        { error: "Ya hay una cita en ese horario para este doctor." },
        { status: 400 }
      );
    }
    const citaExistentePaciente = await prisma.appointment.findFirst({
      where: {
        patient_id: patient_id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: start },
                programed_end_date_time: { gt: start },
              },
              {
                programed_date_time: { lt: end },
                programed_end_date_time: { gte: end },
              },
              {
                programed_date_time: { gte: start },
                programed_end_date_time: { lte: end },
              },
            ],
          },
        ],
      },
    });

    if (citaExistentePaciente) {
      return NextResponse.json(
        { error: "Ya tienes una cita reservada en ese horario." },
        { status: 400 }
      );
    }

    await prisma.appointment.create({
      data: {
        scheduled_on: new Date(),
        programed_date_time: start,
        programed_end_date_time: end,
        specialty: "Cita normal",
        reason: descripcion,
        patient_id: patient_id,
        doctor_id: doctor,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });

    return NextResponse.json({ message: "Cita creada con exito." });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json(
      { error: "Error al crear la cita." },
      { status: 500 }
    );
  }
}
