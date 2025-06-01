"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma } from "@prisma/client";

export async function create({
  data,
}: {
  data: any;
}): Promise<{ ok: boolean }> {
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

export async function eliminate({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
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

export async function restore({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
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

export async function accountsReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  deudas: Prisma.AccountGetPayload<{
    include: {
      patient: true;
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
        whereClause.created_at.gte = data.from;
      }
      if (data.to) {
        whereClause.created_at.lte = data.to;
      }
    }
    const deudas = await prisma.account.findMany({
      where: whereClause,
      include: {
        patient: true,
      },
    });
    return {
      deudas: deudas,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { deudas: [], ok: false };
  }
}
