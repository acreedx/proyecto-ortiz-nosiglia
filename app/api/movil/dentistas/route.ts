import { prisma } from "@/config/prisma";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const dentistas = await prisma.person.findMany({
      where: {
        rol: {
          roleName: "Dentista",
        },
      },
      select: {
        id: true,
        firstName: true,
        secondName: true,
        familyName: true,
        gender: true,
        birthDate: true,
        phone: true,
        mobile: true,
        email: true,
        addressLine: true,
        addressCity: true,
        maritalStatus: true,
        identification: true,
        photoUrl: true,
      },
    });
    return NextResponse.json({ dentistas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
