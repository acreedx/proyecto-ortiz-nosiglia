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
  TChangePasswordSchema,
  TCreateUserSchema,
  TForgotPasswordSchema,
} from "../lib/zod/zschemas";
import { userStatusList } from "../types/statusList";

const url = process.env.SITE_URL;

export async function createUser({
  data,
  image,
}: {
  data: TCreateUserSchema;
  image: File | undefined;
}): Promise<{ ok: boolean }> {
  try {
    if (!data.token) {
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
        role_id: 6,
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
}: {
  data: TChangePasswordSchema;
}) {
  try {
    const session = await auth();
    if (!session) return { ok: false };
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
        password: await hashPassword(data.newPassword),
        password_attempts: 0,
        password_expiration: getPasswordExpiration(),
        status: userStatusList.ACTIVO,
        last_login: undefined,
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
  } catch (e: any) {
    return { ok: false };
  }
}
