import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const pacientes = await prisma.user.findMany({
      where: {
        role: {
          role_name: rolesList.PACIENTE,
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
    });
    return NextResponse.json({ pacientes: pacientes });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
