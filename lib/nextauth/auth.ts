import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { ZodError } from "zod";
import { signInSchema } from "../zod/zschemas";
import { prisma } from "../prisma/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          const { username, password } =
            await signInSchema.parseAsync(credentials);

          const dbUser = await prisma.user.findFirst({
            where: {
              username: username,
              password: password,
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

          if (dbUser) {
            return {
              username: dbUser.username,
              first_name: dbUser.first_name,
              last_name: dbUser.last_name,
              email: dbUser.email,
              photo_url: dbUser.photo_url,
              is_super_admin: dbUser.is_super_admin,
              role: dbUser.role.role_name,
              permissions: dbUser.role.role_permissions.map(
                (rp) => rp.permission
              ),
            };
          } else {
            throw new CredentialsSignin("Error en el login");
          }
        } catch (error) {
          console.log(error);
          if (error instanceof ZodError) {
            return null;
          }
          return null;
        }
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
    authorized: async ({ auth }) => {
      return !!auth;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
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
