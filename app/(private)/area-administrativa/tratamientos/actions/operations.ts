"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  treatmentStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import {
  CreateCarePlanSchema,
  EditCarePlanSchema,
  TCreateCarePlanSchema,
  TEditCarePlanSchema,
} from "../../../../../lib/zod/z-care-plan-schemas";

export async function create({
  data,
}: {
  data: TCreateCarePlanSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = CreateCarePlanSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.carePlan.create({
      data: {
        treatment_type: data.treatment_type,
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date),
        estimated_appointments: data.estimated_appointments,
        days_between_appointments: data.days_between_appointments,
        cost: data.cost,
        status: userStatusList.ACTIVO,
        patient_id: data.patient_id,
      },
    });
    revalidatePath("/area-administrativa/tratamientos");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
}: {
  data: TEditCarePlanSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = EditCarePlanSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.carePlan.update({
      where: {
        id: data.id,
      },
      data: {
        treatment_type: data.treatment_type,
        title: data.title,
        description: data.description,
        start_date: new Date(data.start_date),
        estimated_appointments: data.estimated_appointments,
        days_between_appointments: data.days_between_appointments,
        cost: data.cost,
        patient_id: data.patient_id,
      },
    });
    revalidatePath("/area-administrativa/tratamientos");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function eliminate({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.carePlan.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
    });
    revalidatePath("/area-administrativa/tratamientos");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function restore({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.carePlan.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
    });
    revalidatePath("/area-administrativa/tratamientos");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function complete({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.carePlan.update({
      where: {
        id: id,
      },
      data: {
        end_date: new Date(),
        status: treatmentStatusList.COMPLETADO,
      },
    });
    revalidatePath("/area-administrativa/tratamientos");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
