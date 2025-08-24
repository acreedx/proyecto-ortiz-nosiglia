"use server";

import { revalidatePath } from "next/cache";
import { uploadProfileImage } from "../../../../../lib/firebase/image-uploader";
import { registerLog } from "../../../../../lib/logs/logger";
import { auth } from "../../../../../lib/nextauth/auth";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  EditProfileSchema,
  TEditProfileSchema,
} from "../../../../../lib/zod/z-profile-schemas";

export async function edit({
  data,
  image,
}: {
  data: TEditProfileSchema;
  image: File | undefined;
}): Promise<{ ok: boolean; errorMessage?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditProfileSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const isAnyUserWithId = await prisma.user.findFirst({
      where: {
        identification: data.identification.toString(),
        NOT: {
          id: data.id,
        },
      },
    });
    if (isAnyUserWithId) {
      return {
        ok: false,
        errorMessage: "Ya existe un usuario con ese Carnet de identidad",
      };
    }
    await prisma.user.update({
      where: {
        id: data.id,
      },
      data: {
        identification: data.identification.toString(),
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: new Date(data.birth_date),
        phone: data.phone.toString(),
        mobile: data.mobile.toString(),
        email: data.email,
        address_line: data.address_line,
        address_city: data.address_city,
        ...(image && {
          photo_url: await uploadProfileImage(image),
        }),
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/staff-profile");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
