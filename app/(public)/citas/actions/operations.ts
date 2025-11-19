"use server";
import { revalidatePath } from "next/cache";
import {
  CreateAppointmentCalendarSchema,
  EditAppointmentSchema,
  TCancelAppointmentSchema,
  TCompleteAppointmentSchema,
  TCreateAppointmentCalendarSchema,
  TEditAppointmentSchema,
} from "../../../../lib/zod/z-appointment-calendar-patient.schemas";
import { auth } from "../../../../lib/nextauth/auth";
import { prisma } from "../../../../lib/prisma/prisma";
import {
  appointmentStatusList,
  debtsStatusList,
  encounterStatusList,
  userStatusList,
} from "../../../../types/statusList";
import { registerLog } from "../../../../lib/logs/logger";
import {
  appointmentCost,
  appointmentDefaultInstructions,
} from "../../../../types/consts";
import { sendEmail } from "../../../../lib/nodemailer/mailer";
import formatDateLocal, {
  timeFormatter,
} from "../../../../types/dateFormatter";

export async function createDentistAppointment({
  data,
}: {
  data: TCreateAppointmentCalendarSchema;
}): Promise<{ ok: boolean; mensaje?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateAppointmentCalendarSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const userPatient = await prisma.user.findUnique({
      where: {
        id: session.user.id_db,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
    });
    if (!userPatient) {
      return {
        ok: false,
      };
    }
    const userDoctor = await prisma.user.findUnique({
      where: {
        id: data.doctor_id,
      },
      include: {
        staff: {
          include: {
            doctor: true,
          },
        },
      },
    });
    if (!userDoctor) {
      return {
        ok: false,
      };
    }
    const [horaStr, minutoStr] = data.hora_cita.split(":");
    const fechaConHora = new Date(data.programed_date_time);
    fechaConHora.setUTCHours(
      parseInt(horaStr, 10),
      parseInt(minutoStr, 10),
      0,
      0
    );
    const fechaFin = new Date(fechaConHora.getTime() + 30 * 60 * 1000);
    const citaExistente = await prisma.appointment.findFirst({
      where: {
        doctor_id: userDoctor.staff!.doctor!.id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: fechaConHora },
                programed_end_date_time: { gt: fechaConHora },
              },
              {
                programed_date_time: { lt: fechaFin },
                programed_end_date_time: { gte: fechaFin },
              },
              {
                programed_date_time: { gte: fechaConHora },
                programed_end_date_time: { lte: fechaFin },
              },
            ],
          },
        ],
      },
    });
    if (citaExistente) {
      return {
        ok: false,
        mensaje:
          "Seleccione otro horario para la cita, ya hay una reservada en esa fecha y hora.",
      };
    }
    const citaExistentePaciente = await prisma.appointment.findFirst({
      where: {
        patient_id: userPatient.patient!.id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: fechaConHora },
                programed_end_date_time: { gt: fechaConHora },
              },
              {
                programed_date_time: { lt: fechaFin },
                programed_end_date_time: { gte: fechaFin },
              },
              {
                programed_date_time: { gte: fechaConHora },
                programed_end_date_time: { lte: fechaFin },
              },
            ],
          },
        ],
      },
    });
    if (citaExistentePaciente) {
      return {
        ok: false,
        mensaje:
          "Seleccione otro horario para la cita, ya tiene una reservada en esa fecha y hora.",
      };
    }
    const createdAppointment = await prisma.appointment.create({
      data: {
        scheduled_on: new Date(),
        programed_date_time: fechaConHora,
        programed_end_date_time: fechaFin,
        specialty: "Cita normal",
        patient_instruction: appointmentDefaultInstructions.INSTRUCCIONES,
        reason: data.reason,
        patient_id: userPatient.patient!.id,
        doctor_id: userDoctor.staff!.doctor!.id,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    await sendEmail({
      email: userPatient.email,
      subject: "Confirmación de creación de cita - Centro Ortiz Nosiglia",
      message: `
        Hola ${userPatient.patient!.user.first_name} ${userPatient.patient!.user.last_name},

        Te confirmamos que tu cita ha sido registrada exitosamente en nuestro sistema.

        Detalles de tu cita:
        - Fecha: ${formatDateLocal(createdAppointment.programed_date_time)}
        - Hora: ${timeFormatter(createdAppointment.programed_date_time)}
        - Dentista: ${userDoctor.first_name} ${userDoctor.last_name}
        - Ubicación: Dirección: Calle 15 de Calacoto, DiagnoSur piso 1, consultorio 108, La Paz, Bolivia
        
        Te recomendamos presentarte unos minutos antes de la hora programada.

        Si deseas realizar alguna modificación o tienes consultas adicionales,
        no dudes en comunicarte con nuestro equipo de atención.

        Muchas gracias,
        Centro Ortiz Nosiglia
        
      `,
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function edit({
  data,
}: {
  data: TEditAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditAppointmentSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const [horaStr, minutoStr] = data.hora_cita.split(":");
    const fechaConHora = new Date(data.programed_date_time);
    fechaConHora.setUTCHours(
      parseInt(horaStr, 10),
      parseInt(minutoStr, 10),
      0,
      0
    );
    const fechaFin = new Date(fechaConHora.getTime() + 30 * 60 * 1000);
    await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        programed_date_time: fechaConHora,
        programed_end_date_time: fechaFin,
        reason: data.reason,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function cancelAppointment({
  data,
}: {
  data: TCancelAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        status: appointmentStatusList.STATUS_CANCELADA,
        is_cancelled: true,
        cancellation_date: new Date(),
        cancellation_reason: data.cancellation_reason,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function completeAppointment({
  data,
}: {
  data: TCompleteAppointmentSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const updatedAppointment = await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        status: appointmentStatusList.STATUS_COMPLETADA,
        patient: {
          update: {
            account: {
              update: {
                data: {
                  billing_status: debtsStatusList.CON_DEUDA,
                  calculated_at: new Date(),
                  balance: {
                    increment: appointmentCost.COSTO_CITA,
                  },
                },
              },
            },
          },
        },
      },
      include: {
        doctor: {
          include: {
            staff: true,
          },
        },
        patient: {
          include: {
            account: true,
          },
        },
      },
    });
    await prisma.invoice.create({
      data: {
        account_id: updatedAppointment.patient.account.id,
        date_issued: new Date(),
        type: encounterStatusList.CITA,
        total: appointmentCost.COSTO_CITA,
        note: updatedAppointment.note ?? "ninguna",
        status: userStatusList.ACTIVO,
        staff_id: updatedAppointment.doctor.staff.id,
      },
    });
    await prisma.encounter.create({
      data: {
        type: encounterStatusList.CITA,
        performed_on: new Date(),
        specialty: updatedAppointment.specialty,
        reason: updatedAppointment.reason,
        note: updatedAppointment.note,
        patient_instruction: updatedAppointment.patient_instruction,
        diagnosis: data.diagnosis,
        status: userStatusList.ACTIVO,
        patient_id: updatedAppointment.patient_id,
        doctor_id: updatedAppointment.doctor_id,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function confirmAppointment({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_CONFIRMADA,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function markAppointmentNotAssisted({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_NO_ASISTIDA,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function pendingAppointment({
  id,
}: {
  id: number;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    await prisma.appointment.update({
      where: {
        id: id,
      },
      data: {
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function updateAppointmentDateTime({
  appointmentId,
  newDate,
}: {
  appointmentId: number;
  newDate: Date;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const fechaFin = new Date(newDate.getTime() + 30 * 60 * 1000);
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        programed_date_time: newDate,
        programed_end_date_time: fechaFin,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "página web",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas-dentista");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
