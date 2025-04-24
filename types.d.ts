import { Permission } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    photo_url: string;
    is_super_admin: boolean;
    role: string;
    permissions: Permission[];
  }

  interface Session {
    user: {
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      photo_url: string;
      is_super_admin: boolean;
      role: string;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}
