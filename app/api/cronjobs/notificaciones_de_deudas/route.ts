/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma/prisma";
import { sendEmail } from "../../../../lib/nodemailer/mailer";
import { billingStatus } from "../../../../types/billingStatus";
import { rolesList } from "../../../../lib/nextauth/rolesList";

export async function GET(req: Request) {
  try {
    const PacientesConDeuda = await prisma.patient.findMany({
      where: {
        user: {
          role: {
            role_name: rolesList.PACIENTE,
          },
        },
        account: {
          status: billingStatus.DEUDA,
        },
      },
      include: {
        account: true,
        user: true,
      },
    });
    PacientesConDeuda.forEach(async (paciente) => {
      await sendEmail({
        email: paciente.user.email,
        subject:
          "🔔 Recordatorio de saldo pendiente - Centro Odontológico Ortiz Nosiglia",
        message: `
      Estimado/a ${paciente.user.first_name} ${paciente.user.last_name},

      Esperamos que se encuentre bien. Le escribimos desde el Centro Odontológico Ortiz Nosiglia 
      para recordarle que actualmente tiene un saldo pendiente con nosotros.

      💰 *Monto adeudado:* Bs ${paciente.account.balance}

      Su salud dental es muy importante para nosotros y queremos brindarle la mejor atención posible. Le invitamos a acercarse a nuestro centro para regularizar su situación o para resolver cualquier duda que pueda tener.

      📍 Dirección: Calle 15 de Calacoto, Edificio DiagnoSur, piso 1, consultorio 108  
      🕒 Horarios de atención: Lunes a viernes de 08:00 a 18:00

      Si ya realizó el pago, por favor ignore este mensaje.

      Agradecemos su atención y confianza.

      Atentamente,  
      *Equipo de Ortiz Nosiglia* 💙
    `,
      });
    });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ ok: false });
  }
}
