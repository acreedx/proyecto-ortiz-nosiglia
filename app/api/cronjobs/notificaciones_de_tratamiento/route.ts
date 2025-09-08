import { sendEmail } from "../../../../lib/nodemailer/mailer";
import { prisma } from "../../../../lib/prisma/prisma";
import formatDateLocal from "../../../../types/dateFormatter";
import {
  appointmentStatusList,
  debtsStatusList,
  userStatusList,
} from "../../../../types/statusList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    //obtener los datos
    const pacientes = await prisma.patient.findMany({
      include: {
        account: {
          include: {
            invoice: true,
          },
        },
        user: true,
        appointment: true,
        care_plan: true,
      },
    });
    /*Notificaciones de deudas*/
    const pacientesConDeudas = pacientes.filter(
      (e) => e.account.billing_status === debtsStatusList.CON_DEUDA
    );
    for (const paciente of pacientesConDeudas) {
      const deudasPacienteActivas = paciente.account.invoice.filter(
        (e) => e.status === userStatusList.ACTIVO
      );
      const detalleDeudasPaciente = deudasPacienteActivas
        .map((invoice) => {
          const nota = invoice.note;
          const total = invoice.total;
          const fecha = invoice.date_issued;
          return (
            "- Descripción: " +
            nota +
            ", Costo: " +
            total +
            ", Fecha: " +
            formatDateLocal(fecha)
          );
        })
        .join("\n");
      await sendEmail({
        email: paciente.user.email,
        subject: "⏰ ¡Recordatorio de tu pago de deudas! 🦷",
        message: `
        Hola ${paciente.user.first_name} ${paciente.user.last_name}, 👋

        Queremos recordarte que **tienes una deuda pendiente**.

        No dejes pasar más tiempo, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!

        El costo total de tu deuda es de: ${paciente.account.balance} Bs.

        📄 Detalle de tus deudas:
        ${detalleDeudasPaciente}

        ¡Nos vemos pronto! 💙

        Saludos cordiales,  
        El equipo de Ortiz Nosiglia
        `,
      });
    }
    /*Notificaciones de tratamientos*/
    const pacientesConTratamientosActivos = pacientes.filter((e) =>
      e.care_plan.some(
        (e) =>
          e.status === userStatusList.ACTIVO ||
          e.status === userStatusList.NUEVO
      )
    );
    for (const paciente of pacientesConTratamientosActivos) {
      if (
        !paciente.appointment.some(
          (e) =>
            e.status === appointmentStatusList.STATUS_CONFIRMADA ||
            e.status === appointmentStatusList.STATUS_PENDIENTE
        )
      ) {
        const tratamientosActivos = paciente.care_plan
          .filter((cp) => cp.status === userStatusList.ACTIVO)
          .map((cp) => `- ${cp.title}`)
          .join("\n");
        await sendEmail({
          email: paciente.user.email,
          subject: "⏰ ¡Recordatorio de tu tratamiento dental! 🦷",
          message: `
            Hola ${paciente.user.first_name} ${paciente.user.last_name}, 👋

            Queremos recordarte que **deberías programar tu próxima cita** para continuar con tu(s) tratamiento(s) en curso.

            📋 Tratamientos activos:
            ${tratamientosActivos}

            No dejes pasar más tiempo, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!

            ¡Nos vemos pronto! 💙

            Saludos cordiales,  
            El equipo de Ortiz Nosiglia
          `,
        });
      }
    }
    return new Response(`Envio de notificaciones exitoso`);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return new Response(`Error al enviar las notificaciones`);
  }
}
