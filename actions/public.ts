"use server";

import bcrypt from "bcryptjs";
import { hashPassword } from "../lib/bcrypt/hasher";
import generateStrongPassword, {
  getPasswordExpiration,
} from "../lib/bcrypt/password-generator";
import { uploadProfileImage } from "../lib/firebase/image-uploader";
import { auth, signIn } from "../lib/nextauth/auth";
import { sendEmail } from "../lib/nodemailer/mailer";
import { prisma } from "../lib/prisma/prisma";
import {
  changePasswordSchema,
  createUserSchema,
  forgotPasswordSchema,
  TChangePasswordSchema,
  TCreateUserSchema,
  TForgotPasswordSchema,
} from "../lib/zod/z-sign-in-cycle-schemas";
import { userStatusList } from "../types/statusList";
import { billingStatus } from "../types/billingStatus";

const url = process.env.SITE_URL;

export async function createUser({
  data,
  image,
}: {
  data: TCreateUserSchema;
  image: File | undefined;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    if (!data.token) {
      return {
        ok: false,
      };
    }
    console.log(data);
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
        role_id: 6,
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
            allergies: data.allergies,
            preconditions: data.preconditions,
            status: userStatusList.ACTIVO,
            account: {
              create: {
                balance: 0.0,
                billing_status: billingStatus.SINDEUDA,
                calculated_at: new Date(),
                status: userStatusList.ACTIVO,
              },
            },
            ...(data.organization_id && {
              organization: {
                connect: {
                  id: data.organization_id,
                },
              },
            }),
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
    await signIn("credentials", {
      username: newUser.identification,
      password: generatedPassword,
      token: data.token,
      redirect: false,
    });
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function changePassword({
  data,
  image,
}: {
  data: TChangePasswordSchema;
  image: File | undefined;
}) {
  try {
    const session = await auth();
    if (!session) return { ok: false };
    const tryParse = changePasswordSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const checkUser = await prisma.user.findUnique({
      where: {
        id: session.user.id_db,
        username: data.username,
        OR: [
          {
            status: userStatusList.ACTIVO,
          },
          {
            status: userStatusList.NUEVO,
          },
        ],
      },
    });
    if (!checkUser) return { ok: false };
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
    const checkPassword = await bcrypt.compare(
      data.actualPassword,
      checkUser.password
    );
    if (!checkPassword) return { ok: false };
    const updatedUser = await prisma.user.update({
      where: {
        id: checkUser.id,
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
        password: await hashPassword(data.newPassword),
        password_attempts: 0,
        password_expiration: getPasswordExpiration(),
        status: userStatusList.ACTIVO,
      },
    });
    await sendEmail({
      email: updatedUser.email,
      subject: "Notificación de cambio de contraseña",
      message: `
      Estimado/a ${updatedUser.first_name} ${updatedUser.last_name},
  
      Se ha realizado un cambio en la contraseña de tu cuenta en la clínica Ortiz Nosiglia. Si no fuiste tú quien realizó esta acción, por favor sigue los siguientes pasos inmediatamente:
  
      1. Ingresa a nuestra página web: ${url}/olvido-de-password.
      2. Dirígete a la sección de "Olvidé mi contraseña" para actualizar tu contraseña de manera segura.
  
      Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.
  
      Fecha y hora de la actualización: ${new Date().toLocaleString()}
  
      ¡Gracias por confiar en nosotros!
  
      Atentamente,
      El equipo de la Clínica Ortiz Nosiglia
    `,
    });
    return { ok: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return { ok: false };
  }
}

export async function forgotPassword({
  data,
}: {
  data: TForgotPasswordSchema;
}) {
  try {
    if (!data.token) {
      return {
        ok: false,
      };
    }
    const tryParse = forgotPasswordSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const checkUser = await prisma.user.findFirst({
      where: {
        username: data.username,
        email: data.email,
        OR: [
          {
            status: userStatusList.ACTIVO,
          },
          {
            status: userStatusList.BLOQUEADO,
          },
          {
            status: userStatusList.NUEVO,
          },
        ],
      },
    });
    if (!checkUser) return { ok: false, message: "Usuario no encontrado" };

    const generatedPassword = generateStrongPassword();
    const updatedUser = await prisma.user.update({
      where: {
        id: checkUser.id,
      },
      data: {
        password: await hashPassword(generatedPassword),
        password_attempts: 0,
        password_expiration: getPasswordExpiration(),
        status: userStatusList.NUEVO,
        last_login: null,
      },
    });

    await sendEmail({
      email: updatedUser.email,
      subject: "Restablecimiento de contraseña realizado",
      message: `
      Estimado/a ${updatedUser.first_name} ${updatedUser.last_name},
  
      Se ha realizado un cambio en la contraseña de tu cuenta en la clínica Ortiz Nosiglia. Si no fuiste tú quien realizó esta acción, por favor sigue los siguientes pasos inmediatamente:

      1. Ingresa a nuestra página web: ${url}/olvido-de-password.
      2. Dirígete a la sección de "Olvidé mi contraseña" para actualizar tu contraseña de manera segura.

      Aquí tienes tus nuevas credenciales:
    
        - **Nombre de usuario**: ${updatedUser.username}
        - **Contraseña**: ${generatedPassword}
    
        Por favor, guarda esta información en un lugar seguro.
        
        Despues de tu primer inicio de sesión se te pedirá que cambies tu contraseña
  
      Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.

      ¡Gracias por confiar en nosotros!
  
      Atentamente,
      El equipo de la Clínica Ortiz Nosiglia
    `,
    });
    return { ok: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
    return { ok: false };
  }
}
