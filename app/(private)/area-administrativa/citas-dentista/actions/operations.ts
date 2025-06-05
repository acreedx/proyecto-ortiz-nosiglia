"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  appointmentStatusList,
  debtsStatusList,
  encounterStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { appointmentCost } from "../../../../../types/consts";
import { auth } from "../../../../../lib/nextauth/auth";
import {
  CreateAppointmentCalendarSchema,
  EditAppointmentSchema,
  TCancelAppointmentSchema,
  TCompleteAppointmentSchema,
  TCreateAppointmentCalendarSchema,
  TEditAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-calendar.schemas";

export async function createDentistAppointment({
  data,
}: {
  data: TCreateAppointmentCalendarSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = CreateAppointmentCalendarSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const userPatient = await prisma.user.findUnique({
      where: {
        id: data.patient_id,
      },
      include: {
        patient: true,
      },
    });
    if (!userPatient) {
      return {
        ok: false,
      };
    }
    const userDoctor = await prisma.user.findUnique({
      where: {
        id: session.user.id_db,
      },
      include: {
        staff: {
          include: {
            doctor: true,
          },
        },
      },
    });
    if (!userDoctor)
      return {
        ok: false,
      };
    /*
    todo validar si el dentista tiene alguna cita en ese horario
    const start = new Date(`${fecha}T${hora}`);
    const end = new Date(start.getTime() + 30 * 60 * 1000);
    const citaExistente = await prisma.appointment.findFirst({
      where: {
        practitionerId: session.user.id,
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
      return {
        success: false,
        error:
          "Seleccione otro horario para la cita, ya hay una reservada en esa fecha y hora.",
      };
    }
    todo validar si el paciente tiene una cita en ese horario
    const citaExistentePaciente = await prisma.appointment.findFirst({
      where: {
        subjectId: paciente,
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
      return {
        success: false,
        error:
          "Seleccione otro horario para la cita, ya tiene una reservada en esa fecha y hora.",
      };
    }
    */
    const [horaStr, minutoStr] = data.hora_cita.split(":");
    const fechaConHora = new Date(data.programed_date_time);
    fechaConHora.setUTCHours(
      parseInt(horaStr, 10),
      parseInt(minutoStr, 10),
      0,
      0
    );
    console.log(fechaConHora);
    await prisma.appointment.create({
      data: {
        scheduled_on: new Date(),
        programed_date_time: fechaConHora,
        specialty: data.specialty,
        reason: data.reason,
        note: data.note,
        patient_instruction: data.patient_instruction,
        patient_id: userPatient.patient!.id,
        doctor_id: userDoctor.staff!.doctor!.id,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
}: {
  data: TEditAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = EditAppointmentSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
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
    await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        programed_date_time: new Date(data.programed_date_time),
        specialty: data.specialty,
        reason: data.reason,
        note: data.note,
        patient_instruction: data.patient_instruction,
        doctor_id: userDoctor!.staff!.doctor!.id,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function cancelAppointment({
  data,
}: {
  data: TCancelAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        status: appointmentStatusList.STATUS_CANCELADA,
        is_cancelled: true,
        cancellation_date: new Date(),
        cancellation_reason: data.cancellation_reason,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function completeAppointment({
  data,
}: {
  data: TCompleteAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        status: appointmentStatusList.STATUS_COMPLETADA,
        patient: {
          update: {
            account: {
              update: {
                data: {
                  billing_status: debtsStatusList.CON_DEUDA,
                  calculated_at: new Date(),
                  balance: {
                    increment: appointmentCost.COSTO_CITA,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        doctor: {
          include: {
            staff: true,
          },
        },
        patient: {
          include: {
            account: true,
          },
        },
      },
    });

    await prisma.invoice.create({
      data: {
        account_id: updatedAppointment.patient.account.id,
        date_issued: new Date(),
        type: encounterStatusList.CITA,
        total: appointmentCost.COSTO_CITA,
        note: updatedAppointment.note ?? "ninguna",
        status: userStatusList.ACTIVO,
        staff_id: updatedAppointment.doctor.staff.id,
      },
    });
    await prisma.encounter.create({
      data: {
        type: encounterStatusList.CITA,
        performed_on: new Date(),
        specialty: updatedAppointment.specialty,
        reason: updatedAppointment.reason,
        note: updatedAppointment.note,
        patient_instruction: updatedAppointment.patient_instruction,
        diagnosis: data.diagnosis,
        status: userStatusList.ACTIVO,
        patient_id: updatedAppointment.patient_id,
        doctor_id: updatedAppointment.doctor_id,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function confirmAppointment({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_CONFIRMADA,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function markAppointmentNotAssisted({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_NO_ASISTIDA,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function pendingAppointment({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
