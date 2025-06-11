"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  EditPayrollSchema,
  TEditPayrollSchema,
} from "../../../../../lib/zod/z-payroll-schemas";
import {
  CreateQualificationSchema,
  EditQualificationSchema,
  TCreateQualificationSchema,
  TEditQualificationSchema,
} from "../../../../../lib/zod/z-qualification-schemas";
import { userStatusList } from "../../../../../types/statusList";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma } from "@prisma/client";
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function createQualification({
  data,
}: {
  data: TCreateQualificationSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateQualificationSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.user.update({
      where: {
        id: data.doctor_id,
      },
      data: {
        staff: {
          update: {
            doctor: {
              update: {
                qualification: {
                  create: {
                    type: data.type,
                    name: data.name,
                    institution: data.institution,
                    status: userStatusList.ACTIVO,
                    country: data.country,
                    obtainment_date: new Date(data.obtainment_date),
                  },
                },
              },
            },
          },
        },
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/personal");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editQualification({
  data,
}: {
  data: TEditQualificationSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditQualificationSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.qualification.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        type: data.type,
        institution: data.institution,
        country: data.country,
        obtainment_date: new Date(data.obtainment_date),
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/personal");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editPayroll({
  data,
}: {
  data: TEditPayrollSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditPayrollSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.user.update({
      where: {
        id: data.user_id,
      },
      data: {
        staff: {
          update: {
            payroll: {
              upsert: {
                update: {
                  salary: data.salary,
                  bonus: data.bonus,
                },
                create: {
                  salary: data.salary,
                  bonus: data.bonus,
                },
              },
            },
          },
        },
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/personal");
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
    await prisma.qualification.update({
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
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/personal");
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
    await prisma.qualification.update({
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
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/personal");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function staffReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  personal: Prisma.UserGetPayload<{
    include: {
      staff: true;
      role: true;
    };
  }>[];
  ok?: boolean;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        personal: [],
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
    const personal = await prisma.user.findMany({
      where: whereClause,
      include: {
        staff: true,
        role: true,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "personal",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      personal: personal,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { personal: [], ok: false };
  }
}
