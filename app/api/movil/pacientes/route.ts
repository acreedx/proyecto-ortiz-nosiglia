import { prisma } from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const pacientes = await prisma.patient.findMany({
      select: {
        id: true,
        resourceType: true,
        user: {
          select: {
            status: true,
          },
        },
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
        allergies: true,
      },
    });
    return NextResponse.json({ pacientes: pacientes });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
