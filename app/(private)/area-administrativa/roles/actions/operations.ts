"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";

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
