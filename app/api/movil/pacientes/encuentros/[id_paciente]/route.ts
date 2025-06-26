import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";

export const dynamic = "force-dynamic";
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id_paciente: string }> }
): Promise<NextResponse> {
  const { id_paciente } = await params;
  try {
    const paciente = await prisma.user.findUnique({
      where: {
        id: Number(id_paciente),
      },
      include: {
        patient: {
          include: {
            care_plan: true,
            appointment: true,
            encounter: true,
            emergency_contact: true,
            imaging_study: true,
            odontogram: {
              include: {
                odontogram_row: true,
              },
            },
            organization: true,
          },
        },
      },
    });
    return NextResponse.json({ paciente: paciente });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
