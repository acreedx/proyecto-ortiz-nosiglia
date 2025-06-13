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
import { registerLog } from "../../../../../lib/logs/logger";
import { auth } from "../../../../../lib/nextauth/auth";

export async function create({
  data,
  image,
}: {
  data: TCreateUserSchema;
  image: File | undefined;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = createUserSchema.safeParse(data);
    if (!tryParse.success) {
      console.log(tryParse.error);
      return {
        ok: false,
      };
    }
    const isAnyUserWithId = await prisma.user.findFirst({
      where: {
        identification: data.identification.toString(),
      },
    });
    if (isAnyUserWithId) {
      return {
        ok: false,
        message: "Ya existe un usuario con ese carnet de identidad",
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
            status: userStatusList.ACTIVO,
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
                status: userStatusList.ACTIVO,
                odontogram_row: {
                  createMany: {
                    data: [
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICSI",
                        temp: "61",
                        pieza: "21",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILSI",
                        temp: "62",
                        pieza: "22",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CSI",
                        temp: "63",
                        pieza: "23",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMSI",
                        temp: "64",
                        pieza: "24",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMSI",
                        temp: "65",
                        pieza: "25",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MSI",
                        pieza: "26",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MSI",
                        pieza: "27",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MSI",
                        pieza: "28",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MII",
                        pieza: "38",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MII",
                        pieza: "37",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MII",
                        pieza: "36",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMII",
                        temp: "75",
                        pieza: "35",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMII",
                        temp: "74",
                        pieza: "34",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CII",
                        temp: "73",
                        pieza: "33",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILII",
                        temp: "72",
                        pieza: "32",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICII",
                        temp: "71",
                        pieza: "31",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICSD",
                        temp: "51",
                        pieza: "11",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILSD",
                        temp: "52",
                        pieza: "12",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CSD",
                        temp: "53",
                        pieza: "13",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMSD",
                        temp: "54",
                        pieza: "14",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMSD",
                        temp: "55",
                        pieza: "15",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MSD",
                        pieza: "16",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MSD",
                        pieza: "17",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MSD",
                        pieza: "18",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MID",
                        pieza: "48",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MID",
                        pieza: "47",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MID",
                        pieza: "46",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMID",
                        temp: "85",
                        pieza: "45",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMID",
                        temp: "84",
                        pieza: "44",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CID",
                        temp: "83",
                        pieza: "43",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILID",
                        temp: "82",
                        pieza: "42",
                      },
                      {
                        status: userStatusList.ACTIVO,
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
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
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
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.user.update({
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
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.user.update({
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
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        usuarios: [],
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
    const usuarios = await prisma.user.findMany({
      where: whereClause,
      include: {
        role: true,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "usuarios",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
    const session = await auth();
    if (!session) {
      return {
        roles: [],
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
    const roles = await prisma.role.findMany({
      where: whereClause,
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "roles",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
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
