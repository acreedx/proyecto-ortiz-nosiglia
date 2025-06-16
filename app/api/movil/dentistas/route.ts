import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
export const dynamic = "force-dynamic";
export async function GET(): Promise<NextResponse> {
  try {
    const dentistas = await prisma.user.findMany({
      where: {
        role: {
          role_name: rolesList.DENTISTA,
        },
      },
      select: {
        id: true,
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
    return NextResponse.json({ dentistas });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
