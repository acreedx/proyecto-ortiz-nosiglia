"use server";
import { prisma } from "../../lib/prisma/prisma";
import {
  OrganizationSchema,
  TOrganizationSchema,
} from "../../lib/zod/z-organization-schemas";
import { userStatusList } from "../../types/statusList";

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
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editOrganization({
  data,
}: {
  data: TOrganizationSchema;
}): Promise<{ ok: boolean }> {
  try {
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
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
