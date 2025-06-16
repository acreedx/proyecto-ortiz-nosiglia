import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma/prisma";
import {
  appointmentStatusList,
  debtsStatusList,
  userStatusList,
} from "../../../../../../../types/statusList";
import { appointmentCost } from "../../../../../../../types/consts";

export const dynamic = "force-dynamic";
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id_cita: string; diagnostico: string }> }
): Promise<NextResponse> {
  const { id_cita, diagnostico } = await params;
  try {
    const cita = await prisma.appointment.findFirst({
      where: {
        id: Number(id_cita),
      },
    });
    if (!cita) {
      return NextResponse.json(
        { error: "No existe esa cita" },
        { status: 500 }
      );
    }
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: Number(id_cita),
      },
      data: {
        status: appointmentStatusList.STATUS_COMPLETADA,
        note: diagnostico,
      },
    });
    await prisma.encounter.create({
      data: {
        type: updatedAppointment.specialty,
        performed_on: updatedAppointment.programed_date_time,
        specialty: updatedAppointment.specialty,
        reason: updatedAppointment.reason,
        note: updatedAppointment.note,
        patient_instruction: updatedAppointment.patient_instruction,
        status: userStatusList.ACTIVO,
        diagnosis: diagnostico,
        patient_id: updatedAppointment.patient_id,
        doctor_id: updatedAppointment.doctor_id,
      },
    });
    await prisma.patient.update({
      where: {
        id: updatedAppointment.patient_id,
      },
      data: {
        account: {
          update: {
            data: {
              balance: {
                increment: appointmentCost.COSTO_CITA,
              },
              billing_status: debtsStatusList.CON_DEUDA,
            },
          },
        },
      },
    });
    return NextResponse.json({ message: "Cita completada con exito" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
