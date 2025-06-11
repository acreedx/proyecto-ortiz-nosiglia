"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import { userStatusList } from "../../../../../types/statusList";
import {
  CreateTreatmentSchema,
  EditTreatmentSchema,
  TCreateTreatmentSchema,
  TEditTreatmentSchema,
} from "../../../../../lib/zod/z-treatment-schemas";
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function create({
  data,
}: {
  data: TCreateTreatmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateTreatmentSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.treatment.create({
      data: {
        treatment_type: data.treatment_type,
        title: data.title,
        description: data.description,
        estimated_appointments: data.estimated_appointments,
        days_between_appointments: data.days_between_appointments,
        cost_estimation: data.cost_estimation * 100,
        status: userStatusList.ACTIVO,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "tipos de tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/tipos-de-tratamiento");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
}: {
  data: TEditTreatmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditTreatmentSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.treatment.update({
      where: {
        id: data.id,
      },
      data: {
        treatment_type: data.treatment_type,
        title: data.title,
        description: data.description,
        estimated_appointments: data.estimated_appointments,
        days_between_appointments: data.days_between_appointments,
        cost_estimation: data.cost_estimation,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "tipos de tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/tipos-de-tratamiento");
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.treatment.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
    });
    await registerLog({
      type: "sistema",
      action: "deshabilitar",
      module: "tipos de tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/tipos-de-tratamiento");
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.treatment.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
    });
    await registerLog({
      type: "sistema",
      action: "restaurar",
      module: "tipos de tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/tipos-de-tratamiento");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
