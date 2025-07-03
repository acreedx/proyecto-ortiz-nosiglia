import bcrypt from "bcryptjs";
import { CredentialsSignin } from "next-auth";
import { signInSchema } from "../zod/z-sign-in-cycle-schemas";
import { verifyCaptchaToken } from "../captcha/validate-captcha";
import { prisma } from "../prisma/prisma";
import { userStatusList } from "../../types/statusList";

class NewUserError extends CredentialsSignin {
  code = "new";
}
class BlockedUserError extends CredentialsSignin {
  code = "blocked";
}
class ExpiredPasswordError extends CredentialsSignin {
  code = "expired";
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function validateUserLogin({ username, password, token }: any) {
  const parsed = await signInSchema.parseAsync({ username, password, token });

  if (!parsed.token) {
    throw new Error("Token inválido");
  }

  const captchaData = await verifyCaptchaToken(parsed.token);
  if (!captchaData || !captchaData.success || captchaData.score < 0.5) {
    throw new Error("Captcha Fallido");
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      username: parsed.username,
      OR: [
        { status: userStatusList.ACTIVO },
        { status: userStatusList.NUEVO },
        { status: userStatusList.BLOQUEADO },
      ],
    },
    include: {
      role: {
        include: { role_permissions: { include: { permission: true } } },
      },
    },
  });

  if (!dbUser) {
    throw new CredentialsSignin("Error en el login");
  }

  const isPasswordValid = await bcrypt.compare(
    parsed.password,
    dbUser.password
  );
  if (!isPasswordValid) {
    if (dbUser.password_attempts >= 5) {
      await prisma.user.update({
        where: { id: dbUser.id },
        data: { status: userStatusList.BLOQUEADO },
      });
      throw new BlockedUserError(
        "El usuario está bloqueado, cambie su contraseña para continuar"
      );
    }

    await prisma.user.update({
      where: { id: dbUser.id },
      data: { password_attempts: dbUser.password_attempts + 1 },
    });

    throw new CredentialsSignin("Usuario o contraseña incorrectos");
  }

  if (dbUser.status === userStatusList.BLOQUEADO) {
    throw new CredentialsSignin(
      "El usuario está bloqueado, cambie su contraseña para continuar"
    );
  }

  if (dbUser.password_expiration < new Date()) {
    throw new ExpiredPasswordError(
      "Su contraseña ha expirado, debe cambiarla para iniciar sesión"
    );
  }

  if (dbUser.last_login !== null && dbUser.status === userStatusList.NUEVO) {
    throw new NewUserError(
      "Usuario nuevo, debe cambiar su contraseña para poder continuar"
    );
  }

  await prisma.user.update({
    where: { id: dbUser.id },
    data: { password_attempts: 0, last_login: new Date() },
  });

  return {
    id_db: dbUser.id,
    username: dbUser.username,
    first_name: dbUser.first_name,
    last_name: dbUser.last_name,
    email: dbUser.email,
    photo_url: dbUser.photo_url,
    is_super_admin: dbUser.is_super_admin,
    last_login: dbUser.last_login,
    role: dbUser.role.role_name,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    permissions: dbUser.role.role_permissions.map((rp: any) => rp.permission),
  };
}
