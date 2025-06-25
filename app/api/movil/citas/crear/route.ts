import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../types/statusList";
import { ZodError } from "zod";
import { CreateAppointmentMobileSchema } from "../../../../../lib/zod/z-appointment-mobile-shemas";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const data = CreateAppointmentMobileSchema.parse(await req.json());
    console.log(data);
    const userPatient = await prisma.user.findUnique({
      where: {
        id: data.patient_id,
      },
      include: {
        patient: true,
      },
    });
    if (!userPatient || !userPatient.patient) {
      return NextResponse.json(
        { error: "No existe el paciente seleccionado" },
        { status: 400 }
      );
    }
    const userDoctor = await prisma.user.findUnique({
      where: {
        id: data.doctor_id,
      },
      include: {
        staff: {
          include: {
            doctor: true,
          },
        },
      },
    });
    if (!userDoctor || !userDoctor.staff || !userDoctor.staff.doctor) {
      return NextResponse.json(
        { error: "No existe el dentista seleccionado" },
        { status: 400 }
      );
    }
    const [horaStr, minutoStr] = data.hora_cita.split(":");
    const fechaConHora = new Date(data.programed_date_time);
    fechaConHora.setUTCHours(
      parseInt(horaStr, 10),
      parseInt(minutoStr, 10),
      0,
      0
    );
    const fechaFin = new Date(fechaConHora.getTime() + 30 * 60 * 1000);
    if (fechaConHora <= new Date()) {
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
        doctor_id: data.doctor_id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: fechaConHora },
                programed_end_date_time: { gt: fechaConHora },
              },
              {
                programed_date_time: { lt: fechaFin },
                programed_end_date_time: { gte: fechaFin },
              },
              {
                programed_date_time: { gte: fechaConHora },
                programed_end_date_time: { lte: fechaFin },
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
        patient_id: userPatient.patient.id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: fechaConHora },
                programed_end_date_time: { gt: fechaConHora },
              },
              {
                programed_date_time: { lt: fechaFin },
                programed_end_date_time: { gte: fechaFin },
              },
              {
                programed_date_time: { gte: fechaConHora },
                programed_end_date_time: { lte: fechaFin },
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
        programed_date_time: fechaConHora,
        programed_end_date_time: fechaFin,
        specialty: "Cita normal",
        reason: data.reason,
        patient_id: userPatient.patient.id,
        doctor_id: userDoctor.staff.doctor.id,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });

    return NextResponse.json({ message: "Cita creada con exito." });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    if (error instanceof ZodError) {
      const message = error.errors[0]?.message || "Error de validación";
      return NextResponse.json({ message: message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "Error al crear la cita." },
      { status: 500 }
    );
  }
}
