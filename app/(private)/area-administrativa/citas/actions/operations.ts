"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateAppointmentSchema,
  EditAppointmentSchema,
  TCancelAppointmentSchema,
  TCompleteAppointmentSchema,
  TCreateAppointmentSchema,
  TEditAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import {
  appointmentStatusList,
  encounterStatusList,
  userStatusList,
} from "../../../../../types/statusList";

export async function create({
  data,
}: {
  data: TCreateAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = CreateAppointmentSchema.safeParse(data);
    if (!tryParse.success) {
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
    await prisma.appointment.create({
      data: {
        scheduled_on: new Date(),
        programed_date_time: new Date(data.programed_date_time),
        specialty: data.specialty,
        reason: data.reason,
        note: data.note,
        patient_instruction: data.patient_instruction,
        patient_id: userPatient!.patient!.id,
        doctor_id: userDoctor!.staff!.doctor!.id,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    revalidatePath("/area-administrativa/appointment");
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
    revalidatePath("/area-administrativa/citas");
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
    revalidatePath("/area-administrativa/citas");
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
    revalidatePath("/area-administrativa/citas");
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
    revalidatePath("/area-administrativa/citas");
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
    revalidatePath("/area-administrativa/citas");
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
    revalidatePath("/area-administrativa/citas");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
