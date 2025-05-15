import { prisma } from "@/config/prisma";
import { personFullNameFormater } from "@/utils/format_person_full_name";
import { sendEmail } from "@/utils/mailer";
import { NextResponse } from "next/server";
import { AppointmentStatus } from "@/enums/appointmentsStatus";
import { userStatus } from "@/enums/userStatus";
import { birthDateFormater } from "@/utils/birth_date_formater";
import { timeFormatter } from "@/utils/time_formater";
const DAYS_BEFORE_NOTIFICATION = 1;
export async function GET(req: Request) {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const dayAfterTomorrow = new Date(tomorrow.getTime() + 86400000);
    dayAfterTomorrow.setHours(0, 0, 0, 0);
    const citas = await prisma.appointment.findMany({
      where: {
        status: AppointmentStatus.STATUS_CONFIRMADA,
        subject: {
          user: {
            status: {
              not: userStatus.ELIMINADO,
            },
          },
        },
        start: {
          gte: tomorrow,
          lt: dayAfterTomorrow,
        },
      },
      include: {
        subject: true,
        practitioner: true,
      },
    });
    citas.forEach(async (e) => {
      await sendEmail({
        email: e.subject.email,
        subject: "⏰ ¡Recordatorio de tu cita! 🦷",
        message: `
          Hola ${personFullNameFormater(e.subject)}, 👋
      
          Queremos recordarte que tienes una cita confirmada para el día de mañana.

          Motivo: ${e.reason}
          Doctor: ${personFullNameFormater(e.practitioner)}
          Dirección: Calle 15 de Calacoto, DiagnoSur piso 1, consultorio 108, La Paz, Bolivia

          📅 **Fecha**: ${birthDateFormater(e.start)}
          ⏰ **Hora**: ${timeFormatter(e.start)}      
      
          No olvides pasar por aqui, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!

          El costo promedio de la cita es de 150 bs
          ¡Nos vemos pronto! 💙
      
          Saludos cordiales,  
          El equipo de Ortiz Nosiglia
        `,
      });
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json({ ok: false });
  }
}
