"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateAppointmentSchema,
  EditAppointmentSchema,
  TCancelAppointmentSchema,
  TCompleteAppointmentSchema,
  TCreateAppointmentSchema,
  TEditAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import {
  appointmentStatusList,
  debtsStatusList,
  encounterStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { appointmentCost } from "../../../../../types/consts";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma } from "@prisma/client";
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function create({
  data,
}: {
  data: TCreateAppointmentSchema;
}): Promise<{ ok: boolean; mensaje?: string }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateAppointmentSchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const userPatient = await prisma.user.findUnique({
      where: {
        id: data.patient_id,
      },
      include: {
        patient: true,
      },
    });
    if (!userPatient)
      return {
        ok: false,
      };
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

    const start = fechaConHora;
    const end = fechaFin;
    const citaExistente = await prisma.appointment.findFirst({
      where: {
        doctor_id: userDoctor.staff!.doctor!.id,
        AND: [
          {
            OR: [
              {
                programed_date_time: { lte: start },
                programed_end_date_time: { gt: start },
              },
              {
                programed_date_time: { lt: end },
                programed_end_date_time: { gte: end },
              },
              {
                programed_date_time: { gte: start },
                programed_end_date_time: { lte: end },
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
                programed_date_time: { lte: start },
                programed_end_date_time: { gt: start },
              },
              {
                programed_date_time: { lt: end },
                programed_end_date_time: { gte: end },
              },
              {
                programed_date_time: { gte: start },
                programed_end_date_time: { lte: end },
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
    await prisma.appointment.create({
      data: {
        scheduled_on: new Date(),
        programed_date_time: fechaConHora,
        programed_end_date_time: fechaFin,
        specialty: data.specialty,
        reason: data.reason,
        note: data.note,
        patient_instruction: data.patient_instruction,
        patient_id: userPatient.patient!.id,
        doctor_id: userDoctor.staff!.doctor!.id,
        status: appointmentStatusList.STATUS_PENDIENTE,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
    await prisma.appointment.update({
      where: {
        id: data.id,
      },
      data: {
        programed_date_time: fechaConHora,
        programed_end_date_time: fechaFin,
        specialty: data.specialty,
        reason: data.reason,
        note: data.note,
        patient_instruction: data.patient_instruction,
        doctor_id: userDoctor.staff!.doctor!.id,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
        completed_date_time: new Date(),
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
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
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
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/citas");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function horariosDisponibles({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  date,
}: {
  date: Date;
}): Promise<{ horarios: string[]; ok: boolean }> {
  try {
    const intervalosHora = Array.from({ length: 18 }, (_, i) => {
      const hora = 8 + Math.floor(i / 2);
      const minutos = i % 2 === 0 ? "00" : "30";
      const label = `${hora.toString().padStart(2, "0")}:${minutos}`;
      return label;
    });
    return { horarios: intervalosHora, ok: true };
  } catch (e) {
    console.log(e);
    return { horarios: [], ok: false };
  }
}

export async function appointmentReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  citas: Prisma.AppointmentGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
      doctor: {
        include: {
          staff: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }>[];
  ok?: boolean;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        citas: [],
        ok: false,
      };
    }
    const whereClause: {
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (data.from || data.to) {
      whereClause.created_at = {};
      if (data.from) {
        const fromDate = new Date(data.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        whereClause.created_at.gte = fromDate;
      }
      if (data.to) {
        const toDate = new Date(data.to);
        toDate.setUTCHours(23, 59, 59, 999);
        whereClause.created_at.lte = toDate;
      }
    }
    const citas = await prisma.appointment.findMany({
      where: whereClause,
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
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "citas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      citas: citas,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { citas: [], ok: false };
  }
}
