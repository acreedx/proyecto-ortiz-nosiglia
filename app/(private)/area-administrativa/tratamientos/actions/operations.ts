"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  debtsStatusList,
  encounterStatusList,
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
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function create({
  data,
}: {
  data: TCreateCarePlanSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateCarePlanSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const checkUser = await prisma.user.findFirst({
      where: {
        id: data.patient_id,
      },
      include: {
        patient: true,
      },
    });
    if (!checkUser || !checkUser.patient) {
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
        patient_id: checkUser.patient.id,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
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
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.carePlan.update({
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
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.carePlan.update({
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
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return { ok: false };
    }
    const updatedCarePlan = await prisma.carePlan.update({
      where: {
        id: id,
      },
      data: {
        end_date: new Date(),
        status: treatmentStatusList.COMPLETADO,
      },
      include: {
        patient: {
          include: {
            account: true,
          },
        },
      },
    });
    await prisma.account.update({
      where: {
        id: updatedCarePlan.patient.account_id,
      },
      data: {
        billing_status: debtsStatusList.CON_DEUDA,
        calculated_at: new Date(),
        balance: {
          increment: updatedCarePlan.cost,
        },
      },
    });
    await prisma.invoice.create({
      data: {
        account_id: updatedCarePlan.patient.account.id,
        date_issued: new Date(),
        type: encounterStatusList.TRATAMIENTO,
        total: updatedCarePlan.cost,
        note: "ninguna",
        status: userStatusList.ACTIVO,
        staff_id: session.user.id_db,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        tratamientos: [],
        ok: false,
      };
    }
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
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        tiposDeTratamiento: [],
        ok: false,
      };
    }
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
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "tipos de tratamientos",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
