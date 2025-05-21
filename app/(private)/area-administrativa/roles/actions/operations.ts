"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  EditRoleSchema,
  RoleSchema,
  TEditRoleSchema,
  TRoleSchema,
} from "../../../../../lib/zod/z-role-schemas";
import { userStatusList } from "../../../../../types/statusList";
import { rolesList } from "../../../../../lib/nextauth/rolesList";

export async function create({
  data,
}: {
  data: TRoleSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = RoleSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.$transaction(async (tx) => {
      const newRole = await tx.role.create({
        data: {
          role_name: data.role_name,
          description: data.description,
          is_protected: false,
          status: userStatusList.ACTIVO,
        },
      });
      await tx.rolePermissions.createMany({
        data: data.permissions.map((permissionId) => ({
          rol_id: newRole.id,
          permission_id: permissionId,
        })),
      });
    });
    revalidatePath("/area-administrativa/roles");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
}: {
  data: TEditRoleSchema;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = EditRoleSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    if (data.role_name === rolesList.ADMINISTRADOR && data.id === 3) {
      return {
        ok: false,
      };
    }
    await prisma.$transaction([
      prisma.role.update({
        where: { id: data.id },
        data: {
          role_name: data.role_name,
          description: data.description,
        },
      }),
      prisma.rolePermissions.deleteMany({
        where: { rol_id: data.id },
      }),
      prisma.rolePermissions.createMany({
        data: data.permissions.map((permissionId) => ({
          rol_id: data.id,
          permission_id: permissionId,
        })),
      }),
    ]);
    revalidatePath("/area-administrativa/roles");
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
    await prisma.role.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
    });
    revalidatePath("/area-administrativa/roles");
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
    await prisma.role.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
    });
    revalidatePath("/area-administrativa/roles");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
