"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateAppointmentSchema,
  TCreateAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import { appointmentStatusList } from "../../../../../types/statusList";

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

export async function edit({ data }: { data: any }): Promise<{ ok: boolean }> {
  try {
    //const tryParse = OrganizationSchema.safeParse(data);
    //if (!tryParse.success) {
    //  return {
    //    ok: false,
    //  };
    //}
    //await prisma.organization.create({
    //  data: {
    //    name: data.name,
    //    address: data.address,
    //    status: userStatusList.ACTIVO,
    //  },
    //});
    //revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function cancelAppointment({
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
        status: appointmentStatusList.STATUS_CANCELADA,
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
        status: appointmentStatusList.STATUS_COMPLETADA,
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
