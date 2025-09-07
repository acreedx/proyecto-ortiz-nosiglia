import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../../../types/statusList";
import { sendEmail } from "../../../../../../lib/nodemailer/mailer";

export const dynamic = "force-dynamic";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id_cita: string }> }
): Promise<NextResponse> {
  const { id_cita } = await params;
  try {
    const { cancellation_reason } = await req.json();
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
    const appt = await prisma.appointment.update({
      where: {
        id: Number(id_cita),
      },
      data: {
        status: appointmentStatusList.STATUS_CANCELADA,
        is_cancelled: true,
        cancellation_date: new Date(),
        cancellation_reason: cancellation_reason,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    await sendEmail({
      email: appt.patient.user.email,
      subject: "Notificación de cancelación de cita - Centro Ortiz Nosiglia",
      message: `
      Hola ${appt.patient.user.first_name} ${appt.patient.user.last_name},
      
      Te informamos que tu cita para el dia ${appt.programed_date_time.toLocaleDateString()} 
      ha sido cancelada.
      
      Motivo de la cancelación: ${appt.cancellation_reason || "No especificado"}.
      
      Si deseas reprogramar tu cita o tienes alguna consulta adicional, 
      por favor comunícate con nuestro equipo de atención.
      
      Muchas gracias por tu comprensión,
      Centro Ortiz Nosiglia
      `,
    });
    return NextResponse.json({ message: "Cita cancelada con exito" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
