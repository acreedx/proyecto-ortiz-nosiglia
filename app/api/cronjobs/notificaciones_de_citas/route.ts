import { NextResponse } from "next/server";
import { sendEmail } from "../../../../lib/nodemailer/mailer";
import { prisma } from "../../../../lib/prisma/prisma";
import formatDateLocal, {
  timeFormatter,
} from "../../../../types/dateFormatter";
import {
  appointmentStatusList,
  userStatusList,
} from "../../../../types/statusList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(tomorrow.getTime() + 86400000);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    const citas = await prisma.appointment.findMany({
      where: {
        status: appointmentStatusList.STATUS_CONFIRMADA,
        patient: {
          user: {
            status: userStatusList.ACTIVO,
          },
        },
        programed_date_time: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        doctor: {
          include: {
            staff: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    citas.forEach(async (e) => {
      await sendEmail({
        email: e.patient.user.email,
        subject: "⏰ ¡Recordatorio de tu cita! 🦷",
        message: `
          Hola ${e.patient.user.first_name} ${e.patient.user.last_name}, 👋
      
          Queremos recordarte que tienes una cita confirmada para el día de mañana.

          Motivo: ${e.reason}
          Doctor: ${e.doctor.staff.user.first_name} ${e.doctor.staff.user.last_name}
          Dirección: Calle 15 de Calacoto, DiagnoSur piso 1, consultorio 108, La Paz, Bolivia

          📅 **Fecha**: ${formatDateLocal(e.programed_date_time)}
          ⏰ **Hora**: ${timeFormatter(e.programed_date_time)}      
      
          No olvides pasar por aqui, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!

          El costo promedio de la cita es de 150 bs
          ¡Nos vemos pronto! 💙
      
          Saludos cordiales,  
          El equipo de Ortiz Nosiglia
        `,
      });
    });
    return NextResponse.json({ ok: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ ok: false });
  }
}
