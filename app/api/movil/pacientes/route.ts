import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import { Prisma } from "@prisma/client";
import { userStatusList } from "../../../../types/statusList";

export const dynamic = "force-dynamic";
export async function GET(): Promise<
  NextResponse<{
    pacientes: Prisma.UserGetPayload<{
      select: {
        id: true;
        patient: {
          select: {
            allergies: true;
            preconditions: true;
          };
        };
        first_name: true;
        last_name: true;
        birth_date: true;
        phone: true;
        mobile: true;
        email: true;
        address_line: true;
        address_city: true;
        identification: true;
        photo_url: true;
      };
    }>[];
    message?: string;
  }>
> {
  try {
    const pacientes = await prisma.user.findMany({
      where: {
        role: {
          role_name: rolesList.PACIENTE,
        },
        status: {
          in: [userStatusList.ACTIVO, userStatusList.NUEVO],
        },
      },
      select: {
        id: true,
        patient: {
          select: {
            allergies: true,
            preconditions: true,
          },
        },
        first_name: true,
        last_name: true,
        birth_date: true,
        phone: true,
        mobile: true,
        email: true,
        address_line: true,
        address_city: true,
        identification: true,
        photo_url: true,
      },
      orderBy: {
        last_name: "asc",
      },
    });
    return NextResponse.json({ pacientes: pacientes });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json(
      { pacientes: [], message: error.message },
      { status: 500 }
    );
  }
}
