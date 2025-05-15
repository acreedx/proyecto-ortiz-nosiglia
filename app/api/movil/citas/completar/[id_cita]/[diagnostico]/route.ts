import { prisma } from "@/config/prisma";
import { costoCita } from "@/config/system_options";
import { AccountStatus } from "@/enums/accountStatus";
import { AppointmentStatus } from "@/enums/appointmentsStatus";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export async function PUT(
  req: NextRequest,
  { params }: { params: { id_cita: string; diagnostico: string } },
) {
  const { id_cita, diagnostico } = params;
  try {
    const cita = await prisma.appointment.findFirst({
      where: {
        id: id_cita,
      },
    });
    if (!cita) {
      return NextResponse.json(
        { error: "No existe esa cita" },
        { status: 500 },
      );
    }
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: id_cita,
      },
      data: {
        status: AppointmentStatus.STATUS_COMPLETADA,
        note: diagnostico,
      },
    });
    await prisma.encounter.create({
      data: {
        type: updatedAppointment.specialty,
        start: updatedAppointment.start,
        end: updatedAppointment.end,
        reason: updatedAppointment.reason,
        diagnosis: diagnostico,
        subjectId: updatedAppointment.subjectId,
        practitionerId: updatedAppointment.practitionerId,
        appointmentId: updatedAppointment.id,
      },
    });
    await prisma.patient.update({
      where: {
        id: updatedAppointment.subjectId,
      },
      data: {
        account: {
          update: {
            data: {
              balance: {
                increment: costoCita,
              },
              billingStatus: AccountStatus.CON_DEUDA,
            },
          },
        },
      },
    });
    return NextResponse.json({ message: "Cita completada con exito" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
