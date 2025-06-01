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

export async function createQualification({
  data,
}: {
  data: TCreateQualificationSchema;
}): Promise<{ ok: boolean }> {
  try {
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
    await prisma.qualification.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
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
    await prisma.qualification.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
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
    const personal = await prisma.user.findMany({
      where: {
        created_at: {
          gte: data.from,
          lte: data.to,
        },
      },
      include: {
        staff: true,
        role: true,
      },
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
