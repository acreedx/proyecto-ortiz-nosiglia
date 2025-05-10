import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "../zod/z-sign-in-cycle-schemas";
import { prisma } from "../prisma/prisma";
import bcrypt from "bcryptjs";
import { userStatusList } from "../../types/statusList";
import { registerLog } from "../logs/logger";
import { verifyCaptchaToken } from "../captcha/validate-captcha";

class NewUserError extends CredentialsSignin {
  code = "new";
}
class BlockedUserError extends CredentialsSignin {
  code = "blocked";
}
class ExpiredPasswordError extends CredentialsSignin {
  code = "expired";
}
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
        token: {},
      },
      authorize: async (credentials) => {
        const { username, password, token } =
          await signInSchema.parseAsync(credentials);
        if (!token) {
          throw new Error("Token inválido");
        }
        const captchaData = await verifyCaptchaToken(token);
        console.log(captchaData);
        if (!captchaData) {
          throw new Error("Error al verificar el captcha");
        }
        if (!captchaData.success || captchaData.score < 0.5) {
          throw new Error("Captcha Fallido");
        }
        const dbUser = await prisma.user.findFirst({
          where: {
            username: username,
            OR: [
              {
                status: userStatusList.ACTIVO,
              },
              {
                status: userStatusList.NUEVO,
              },
              {
                status: userStatusList.BLOQUEADO,
              },
            ],
          },
          include: {
            role: {
              include: {
                role_permissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        });
        if (!dbUser) {
          throw new CredentialsSignin("Error en el login");
        }

        const isPasswordValid = await bcrypt.compare(password, dbUser.password);
        //Validación de contraseña incorrecta
        if (!isPasswordValid) {
          if (dbUser.password_attempts >= 5) {
            await prisma.user.update({
              where: {
                id: dbUser.id,
              },
              data: {
                status: userStatusList.BLOQUEADO,
              },
            });
            throw new BlockedUserError(
              "El usuario está bloqueado, cambie su contraseña para continuar"
            );
          }
          await prisma.user.update({
            where: {
              id: dbUser.id,
            },
            data: {
              password_attempts: dbUser.password_attempts + 1,
            },
          });
          throw new CredentialsSignin("Usuario o contraseña incorrectos");
        }
        //Validar al usuario bloqueado
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
        if (
          dbUser.last_login !== null &&
          dbUser.status === userStatusList.NUEVO
        ) {
          throw new NewUserError(
            "Usuario nuevo, debe cambiar su contraseña para poder continuar"
          );
        }
        await prisma.user.update({
          where: {
            id: dbUser.id,
          },
          data: {
            password_attempts: 0,
            last_login: new Date(),
          },
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
          permissions: dbUser.role.role_permissions.map((rp) => rp.permission),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as typeof session.user;
      }
      return session;
    },
    async signIn({ user }) {
      await registerLog({
        type: "acceso",
        action: "inicio de sesion",
        module: "página web",
        person_name: user.first_name + " " + user.last_name,
        person_role: user.role,
      });
      return true;
    },
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  logger: {
    async error(error) {
      console.log(error.message);
      return error;
    },
  },
  session: {
    maxAge: 3600,
    strategy: "jwt",
  },
  secret: process.env.JWT_SECRET,
  jwt: {
    maxAge: 3600,
  },
});
