import { Permission } from "@prisma/client";

export function hasPermission(
  permissions: Permission[],
  code: string
): boolean {
  return permissions.some((p) => p.code === code);
}
