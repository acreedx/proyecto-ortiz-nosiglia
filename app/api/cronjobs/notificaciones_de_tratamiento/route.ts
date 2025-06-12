import { sendEmail } from "../../../../lib/nodemailer/mailer";
import { prisma } from "../../../../lib/prisma/prisma";
import { debtsStatusList, userStatusList } from "../../../../types/statusList";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(req: Request) {
  try {
    const pacientes = await prisma.patient.findMany({
      where: {
        user: {
          status: userStatusList.ACTIVO,
        },
        account: {
          billing_status: debtsStatusList.CON_DEUDA,
        },
      },
      include: {
        account: true,
        user: true,
      },
    });
    for (const paciente of pacientes) {
      await sendEmail({
        email: paciente.user.email,
        subject: "⏰ ¡Recordatorio de tu pago de deudas! 🦷",
        message: `
        Hola ${paciente.user.first_name} ${paciente.user.last_name}, 👋
    
        Queremos recordarte que **tienes una deuda pendiente**.
    
        No dejes pasar más tiempo, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!
        El costo de tu deuda es de: ${paciente.account.balance} bs
        ¡Nos vemos pronto! 💙
    
        Saludos cordiales,  
        El equipo de Ortiz Nosiglia
      `,
      });
    }
    const today = new Date();
    const carePlans = await prisma.carePlan.findMany({
      where: { status: userStatusList.ACTIVO },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });

    for (const carePlan of carePlans) {
      const daysSinceStart = Math.floor(
        (today.getTime() - carePlan.start_date.getTime()) /
          (1000 * 60 * 60 * 24)
      );

      const theoreticalAppointments = Math.floor(
        daysSinceStart / carePlan.days_between_appointments
      );

      if (theoreticalAppointments < carePlan.estimated_appointments) {
        const nextAppointmentDate = new Date(carePlan.start_date);
        nextAppointmentDate.setDate(
          carePlan.start_date.getDate() +
            theoreticalAppointments * carePlan.days_between_appointments
        );

        if (nextAppointmentDate.getTime() < today.getTime()) {
          nextAppointmentDate.setDate(
            nextAppointmentDate.getDate() + carePlan.days_between_appointments
          );
        }

        //const daysUntilNextAppointment =
        //  (nextAppointmentDate.getTime() - today.getTime()) /
        //  (1000 * 60 * 60 * 24);

        await sendEmail({
          email: carePlan.patient.user.email,
          subject: "⏰ ¡Recordatorio de tu tratamiento dental! 🦷",
          message: `
          Hola ${carePlan.patient.user.first_name} ${carePlan.patient.user.last_name}, 👋
      
          Queremos recordarte que **deberías programar tu próxima cita** para continuar con tu tratamiento de **${carePlan.title}**.
      
          📅 **Fecha sugerida para la cita**: ${nextAppointmentDate.toLocaleDateString()}
      
          No dejes pasar más tiempo, tu salud dental es muy importante para nosotros. Si tienes alguna duda o necesitas más información, ¡no dudes en contactarnos!
          El costo del estimado del tratamiento es de: ${carePlan.cost} bs
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
