import { Permission } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id_db: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    photo_url: string;
    is_super_admin: boolean;
    last_login: Date | null;
    role: string;
    permissions: Permission[];
  }

  interface Session {
    user: {
      id_db: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      photo_url: string;
      is_super_admin: boolean;
      last_login: Date | null;
      role: string;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}
