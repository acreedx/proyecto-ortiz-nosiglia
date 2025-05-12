"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  EditOrganizationSchema,
  OrganizationSchema,
  TEditOrganizationSchema,
  TOrganizationSchema,
} from "../../../../../lib/zod/z-organization-schemas";
import { userStatusList } from "../../../../../types/statusList";

export async function createOrganization({
  data,
}: {
  data: TOrganizationSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = OrganizationSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.organization.create({
      data: {
        name: data.name,
        address: data.address,
        status: userStatusList.ACTIVO,
      },
    });
    revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editOrganization({
  data,
}: {
  data: TEditOrganizationSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = EditOrganizationSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.organization.update({
      where: {
        id: data.id,
      },
      data: {
        name: data.name,
        address: data.address,
      },
    });
    revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function eliminateOrganization({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.organization.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
    });
    revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function rehabilitateOrganization({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    await prisma.organization.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
    });
    revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
