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
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma, Treatment } from "@prisma/client";

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

export async function treatmentsReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  tratamientos: Prisma.CarePlanGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
    };
  }>[];
  ok?: boolean;
}> {
  try {
    const whereClause: {
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (data.from || data.to) {
      whereClause.created_at = {};
      if (data.from) {
        const fromDate = new Date(data.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        whereClause.created_at.gte = fromDate;
      }
      if (data.to) {
        const toDate = new Date(data.to);
        toDate.setUTCHours(23, 59, 59, 999);
        whereClause.created_at.lte = toDate;
      }
    }
    const tratamientos = await prisma.carePlan.findMany({
      where: whereClause,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    return {
      tratamientos: tratamientos,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { tratamientos: [], ok: false };
  }
}

export async function treatmentTypesReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  tiposDeTratamiento: Treatment[];
  ok?: boolean;
}> {
  try {
    const whereClause: {
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (data.from || data.to) {
      whereClause.created_at = {};
      if (data.from) {
        const fromDate = new Date(data.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        whereClause.created_at.gte = fromDate;
      }
      if (data.to) {
        const toDate = new Date(data.to);
        toDate.setUTCHours(23, 59, 59, 999);
        whereClause.created_at.lte = toDate;
      }
    }
    const tiposDeTratamiento = await prisma.treatment.findMany({
      where: whereClause,
    });
    return {
      tiposDeTratamiento: tiposDeTratamiento,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { tiposDeTratamiento: [], ok: false };
  }
}
