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
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function create({
  data,
}: {
  data: TRoleSchema;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = RoleSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const isAnyRolWithSameName = await prisma.role.findFirst({
      where: {
        role_name: data.role_name,
      },
    });
    if (isAnyRolWithSameName) {
      return {
        ok: false,
        message: "Ya existe un rol con ese nombre",
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
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "roles",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditRoleSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const isAnyRolWithSameName = await prisma.role.findFirst({
      where: {
        role_name: data.role_name,
        NOT: {
          id: data.id,
        },
      },
    });
    if (isAnyRolWithSameName) {
      return {
        ok: false,
        message: "Ya existe un rol con ese nombre",
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
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "roles",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.role.update({
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
      module: "roles",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.role.update({
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
      module: "roles",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/roles");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
