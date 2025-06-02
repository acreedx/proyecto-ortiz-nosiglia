"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  createUserSchema,
  TCreateUserSchema,
} from "../schemas/zcreate-user-schema";
import generateStrongPassword, {
  getPasswordExpiration,
} from "../../../../../lib/bcrypt/password-generator";
import { hashPassword } from "../../../../../lib/bcrypt/hasher";
import { uploadProfileImage } from "../../../../../lib/firebase/image-uploader";
import { sendEmail } from "../../../../../lib/nodemailer/mailer";
import { userStatusList } from "../../../../../types/statusList";
import { billingStatus } from "../../../../../types/billingStatus";
import {
  EditUserSchema,
  TEditUserSchema,
} from "../../../../../lib/zod/z-user-schemas";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma, Role } from "@prisma/client";

export async function create({
  data,
  image,
}: {
  data: TCreateUserSchema;
  image: File | undefined;
}): Promise<{ ok: boolean }> {
  try {
    const tryParse = createUserSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const selected_role = await prisma.role.findUnique({
      where: {
        id: data.rol_id,
      },
    });
    if (!selected_role) {
      return {
        ok: false,
      };
    }
    const generatedPassword = generateStrongPassword(12);
    const newUser = await prisma.user.create({
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
        photo_url: await uploadProfileImage(image),
        username: data.identification.toString(),
        password: await hashPassword(generatedPassword),
        password_expiration: getPasswordExpiration(),
        password_attempts: 0,
        is_super_admin: false,
        status: userStatusList.NUEVO,
        role_id: data.rol_id,
        staff: {
          create: {
            contratation_date: new Date(),
            payroll: {
              create: {},
            },
            doctor: {
              create: {
                specialization: "No registrada",
              },
            },
          },
        },
        patient: {
          create: {
            odontogram: {
              create: {
                odontogram_row: {
                  createMany: {
                    data: [
                      {
                        msc: "ICSI",
                        temp: "61",
                        pieza: "21",
                      },
                      {
                        msc: "ILSI",
                        temp: "62",
                        pieza: "22",
                      },
                      {
                        msc: "CSI",
                        temp: "63",
                        pieza: "23",
                      },
                      {
                        msc: "1PMSI",
                        temp: "64",
                        pieza: "24",
                      },
                      {
                        msc: "2PMSI",
                        temp: "65",
                        pieza: "25",
                      },
                      {
                        msc: "1MSI",
                        pieza: "26",
                      },
                      {
                        msc: "2MSI",
                        pieza: "27",
                      },
                      {
                        msc: "3MSI",
                        pieza: "28",
                      },
                      {
                        msc: "3MII",
                        pieza: "38",
                      },
                      {
                        msc: "2MII",
                        pieza: "37",
                      },
                      {
                        msc: "1MII",
                        pieza: "36",
                      },
                      {
                        msc: "2PMII",
                        temp: "75",
                        pieza: "35",
                      },
                      {
                        msc: "1PMII",
                        temp: "74",
                        pieza: "34",
                      },
                      {
                        msc: "CII",
                        temp: "73",
                        pieza: "33",
                      },
                      {
                        msc: "ILII",
                        temp: "72",
                        pieza: "32",
                      },
                      {
                        msc: "ICII",
                        temp: "71",
                        pieza: "31",
                      },
                      {
                        msc: "ICSD",
                        temp: "51",
                        pieza: "11",
                      },
                      {
                        msc: "ILSD",
                        temp: "52",
                        pieza: "12",
                      },
                      {
                        msc: "CSD",
                        temp: "53",
                        pieza: "13",
                      },
                      {
                        msc: "1PMSD",
                        temp: "54",
                        pieza: "14",
                      },
                      {
                        msc: "2PMSD",
                        temp: "55",
                        pieza: "15",
                      },
                      {
                        msc: "1MSD",
                        pieza: "16",
                      },
                      {
                        msc: "2MSD",
                        pieza: "17",
                      },
                      {
                        msc: "3MSD",
                        pieza: "18",
                      },
                      {
                        msc: "3MID",
                        pieza: "48",
                      },
                      {
                        msc: "2MID",
                        pieza: "47",
                      },
                      {
                        msc: "1MID",
                        pieza: "46",
                      },
                      {
                        msc: "2PMID",
                        temp: "85",
                        pieza: "45",
                      },
                      {
                        msc: "1PMID",
                        temp: "84",
                        pieza: "44",
                      },
                      {
                        msc: "CID",
                        temp: "83",
                        pieza: "43",
                      },
                      {
                        msc: "ILID",
                        temp: "82",
                        pieza: "42",
                      },
                      {
                        msc: "ICID",
                        temp: "81",
                        pieza: "41",
                      },
                    ],
                  },
                },
              },
            },
            status: userStatusList.ACTIVO,
            account: {
              create: {
                balance: 0.0,
                billing_status: billingStatus.SINDEUDA,
                calculated_at: new Date(),
                status: userStatusList.ACTIVO,
              },
            },
          },
        },
      },
    });
    await sendEmail({
      email: data.email,
      subject: "Bienvenido al centro Ortiz Nosiglia",
      message: `
            ¡¡Hola ${data.first_name} ${data.last_name}!
        
            Tu cuenta de usuario ha sido creada exitosamente. Aquí tienes tus credenciales:
        
            - **Nombre de usuario**: ${newUser.username}
            - **Contraseña**: ${generatedPassword}
        
            Por favor, guarda esta información en un lugar seguro.
            
            Despues de tu primer inicio de sesión se te pedirá que cambies tu contraseña
      
            ¡Gracias por unirte a Ortiz Nosiglia!!`,
    });
    revalidatePath("/area-administrativa/organizaciones");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
  image,
}: {
  data: TEditUserSchema;
  image: File | undefined;
}): Promise<{ ok: boolean; errorMessage?: string }> {
  try {
    const tryParse = EditUserSchema.safeParse(data);
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
        role_id: data.rol_id,
      },
    });
    revalidatePath("/area-administrativa/usuarios");
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
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.INACTIVO,
      },
    });
    revalidatePath("/area-administrativa/usuarios");
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
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        status: userStatusList.ACTIVO,
      },
    });
    revalidatePath("/area-administrativa/usuarios");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function usersReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  usuarios: Prisma.UserGetPayload<{
    include: {
      role: true;
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
    const usuarios = await prisma.user.findMany({
      where: whereClause,
      include: {
        role: true,
      },
    });
    return {
      usuarios: usuarios,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { usuarios: [], ok: false };
  }
}

export async function rolesReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  roles: Role[];
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
    const roles = await prisma.role.findMany({
      where: whereClause,
    });
    return {
      roles: roles,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { roles: [], ok: false };
  }
}
