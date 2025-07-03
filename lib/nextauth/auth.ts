import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";

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
      credentials: { username: {}, password: {}, token: {} },
      authorize: async (credentials) => {
        const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
        const res = await fetch(`${baseUrl}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });
        const responseData = await res.json();
        if (!res.ok) {
          switch (responseData.errorType) {
            case "BlockedUserError":
              throw new BlockedUserError(responseData.message);
            case "ExpiredPasswordError":
              throw new ExpiredPasswordError(responseData.message);
            case "NewUserError":
              throw new NewUserError(responseData.message);
            case "CredentialsSignin":
              throw new CredentialsSignin(responseData.message);
            default:
              throw new Error(responseData.message || "Error en login");
          }
        }
        return responseData;
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
  pages: { signIn: "/login", signOut: "/logout" },
  session: { maxAge: 3600, strategy: "jwt" },
  secret: process.env.JWT_SECRET,
  jwt: { maxAge: 3600 },
});
