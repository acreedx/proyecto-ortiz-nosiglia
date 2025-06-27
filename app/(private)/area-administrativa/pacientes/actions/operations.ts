"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateImagingStudySchema,
  TCreateImagingStudySchema,
} from "../../../../../lib/zod/z-imaging-study-schemas";
import { fileUploader } from "../../../../../lib/firebase/file-uploader";
import {
  encounterStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { Files, Organization, Prisma } from "@prisma/client";
import {
  CreatePatientSchema,
  EditPatientSchema,
  TCreatePatientSchema,
  TEditPatientSchema,
} from "../../../../../lib/zod/z-patient-schemas";
import {
  EditEmergencyContact,
  TEditEmergencyContact,
} from "../../../../../lib/zod/z-emergency-contact";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";
import generateStrongPassword, {
  getPasswordExpiration,
} from "../../../../../lib/bcrypt/password-generator";
import { uploadProfileImage } from "../../../../../lib/firebase/image-uploader";
import { hashPassword } from "../../../../../lib/bcrypt/hasher";
import { sendEmail } from "../../../../../lib/nodemailer/mailer";
import { billingStatus } from "../../../../../types/billingStatus";

export async function createPatient({
  data,
  image,
}: {
  data: TCreatePatientSchema;
  image: File | undefined;
}): Promise<{ ok: boolean; message?: string }> {
  try {
    const tryParse = CreatePatientSchema.safeParse(data);
    if (!tryParse.success) {
      console.log(tryParse.error);
      return {
        ok: false,
      };
    }
    const isAnyUserWithId = await prisma.user.findFirst({
      where: {
        identification: data.identification.toString(),
      },
    });
    if (isAnyUserWithId) {
      return {
        ok: false,
        message: "Ya existe un usuario con ese carnet de identidad",
      };
    }
    const generatedPassword = generateStrongPassword(12);
    const newUser = await prisma.user.create({
      data: {
        identification: data.identification.toString(),
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: new Date(data.birth_date),
        phone: data.phone.toString(),
        mobile: data.mobile.toString(),
        email: data.email,
        address_line: data.address_line,
        address_city: data.address_city,
        photo_url: await uploadProfileImage(image),
        username: data.identification.toString(),
        password: await hashPassword(generatedPassword),
        password_expiration: getPasswordExpiration(),
        password_attempts: 0,
        is_super_admin: false,
        status: userStatusList.NUEVO,
        role_id: 6,
        staff: {
          create: {
            status: userStatusList.ACTIVO,
            contratation_date: new Date(),
            payroll: {
              create: {},
            },
            doctor: {
              create: {
                specialization: "No registrada",
              },
            },
          },
        },
        patient: {
          create: {
            odontogram: {
              create: {
                status: userStatusList.ACTIVO,
                odontogram_row: {
                  createMany: {
                    data: [
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICSI",
                        temp: "61",
                        pieza: "21",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILSI",
                        temp: "62",
                        pieza: "22",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CSI",
                        temp: "63",
                        pieza: "23",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMSI",
                        temp: "64",
                        pieza: "24",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMSI",
                        temp: "65",
                        pieza: "25",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MSI",
                        pieza: "26",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MSI",
                        pieza: "27",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MSI",
                        pieza: "28",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MII",
                        pieza: "38",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MII",
                        pieza: "37",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MII",
                        pieza: "36",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMII",
                        temp: "75",
                        pieza: "35",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMII",
                        temp: "74",
                        pieza: "34",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CII",
                        temp: "73",
                        pieza: "33",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILII",
                        temp: "72",
                        pieza: "32",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICII",
                        temp: "71",
                        pieza: "31",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICSD",
                        temp: "51",
                        pieza: "11",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILSD",
                        temp: "52",
                        pieza: "12",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CSD",
                        temp: "53",
                        pieza: "13",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMSD",
                        temp: "54",
                        pieza: "14",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMSD",
                        temp: "55",
                        pieza: "15",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MSD",
                        pieza: "16",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MSD",
                        pieza: "17",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MSD",
                        pieza: "18",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "3MID",
                        pieza: "48",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2MID",
                        pieza: "47",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1MID",
                        pieza: "46",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "2PMID",
                        temp: "85",
                        pieza: "45",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "1PMID",
                        temp: "84",
                        pieza: "44",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "CID",
                        temp: "83",
                        pieza: "43",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ILID",
                        temp: "82",
                        pieza: "42",
                      },
                      {
                        status: userStatusList.ACTIVO,
                        msc: "ICID",
                        temp: "81",
                        pieza: "41",
                      },
                    ],
                  },
                },
              },
            },
            allergies: data.allergies,
            preconditions: data.preconditions,
            status: userStatusList.ACTIVO,
            account: {
              create: {
                balance: 0.0,
                billing_status: billingStatus.SINDEUDA,
                calculated_at: new Date(),
                status: userStatusList.ACTIVO,
              },
            },
            ...(data.organization_id && {
              organization: {
                connect: {
                  id: data.organization_id,
                },
              },
            }),
          },
        },
      },
    });
    await sendEmail({
      email: data.email,
      subject: "Bienvenido al centro Ortiz Nosiglia",
      message: `
        ¡¡Hola ${data.first_name} ${data.last_name}!
    
        Tu cuenta de usuario ha sido creada exitosamente. Aquí tienes tus credenciales:
    
        - **Nombre de usuario**: ${newUser.username}
        - **Contraseña**: ${generatedPassword}
    
        Por favor, guarda esta información en un lugar seguro.
        
        Despues de tu primer inicio de sesión se te pedirá que cambies tu contraseña
  
        ¡Gracias por unirte a Ortiz Nosiglia!!`,
    });
    revalidatePath("/area-administrativa/pacientes");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
export async function create({
  data,
  files,
}: {
  data: TCreateImagingStudySchema;
  files: File[];
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = CreateImagingStudySchema.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    const uploadedFiles: Files[] = [];
    for (const file of files) {
      const url = await fileUploader(file);
      uploadedFiles.push({
        status: userStatusList.ACTIVO,
        media: url,
      } as Files);
    }
    const createdImagingStudy = await prisma.imagingStudy.create({
      data: {
        description: data.description,
        cost: Number(data.cost),
        status: userStatusList.ACTIVO,
        patient_id: data.patient_id,
        files: {
          createMany: {
            data: uploadedFiles,
          },
        },
      },
      include: {
        patient: {
          include: {
            account: true,
          },
        },
      },
    });
    await prisma.invoice.create({
      data: {
        account_id: createdImagingStudy.patient.account.id,
        date_issued: new Date(),
        type: encounterStatusList.ESTUDIO_RADIOGRAFICO,
        total: createdImagingStudy.cost || 0,
        note: "ninguna",
        status: userStatusList.ACTIVO,
        staff_id: session.user.id_db,
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath(
      `/area-administrativa/pacientes/imaging-studies/${data.patient_id}`
    );
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editRow({
  data,
}: {
  data: {
    id: number;
    fecha: Date;
    diagnostico: string;
    tratamiento: string;
  };
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    //todo validar el tamaño de las rows
    //const tryParse = OrganizationSchema.safeParse(data);
    //if (!tryParse.success) {
    //  return {
    //    ok: false,
    //  };
    //}
    await prisma.odontogramRow.update({
      where: {
        id: data.id,
      },
      data: {
        fecha: new Date(data.fecha),
        diagnostico: data.diagnostico,
        tratamiento: data.tratamiento,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editPatient({
  data,
}: {
  data: TEditPatientSchema;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditPatientSchema.safeParse(data);
    if (!tryParse.success) {
      console.log(tryParse.error);
      return {
        ok: false,
      };
    }
    await prisma.patient.update({
      where: {
        id: data.id,
      },
      data: {
        allergies: data.allergies,
        preconditions: data.preconditions,
        organization_id: data.organization_id ?? null,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/pacientes");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function editEmergencyContact({
  data,
}: {
  data: TEditEmergencyContact;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const tryParse = EditEmergencyContact.safeParse(data);
    if (!tryParse.success) {
      return {
        ok: false,
      };
    }
    await prisma.patient.update({
      where: {
        id: data.id,
      },
      data: {
        emergency_contact: {
          upsert: {
            update: {
              relation: data.relation,
              name: data.name,
              phone: data.phone,
              mobile: data.mobile,
              address_line: data.address_line,
              address_city: data.address_city,
            },
            create: {
              status: userStatusList.ACTIVO,
              relation: data.relation,
              name: data.name,
              phone: data.phone,
              mobile: data.mobile,
              address_line: data.address_line,
              address_city: data.address_city,
            },
          },
        },
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath("/area-administrativa/pacientes");
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function patientReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  pacientes: Prisma.PatientGetPayload<{
    include: {
      user: {
        include: {
          role: true;
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
        pacientes: [],
        ok: false,
      };
    }
    const userDateFilter: {
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};

    if (data.from) {
      const fromDate = new Date(data.from);
      fromDate.setUTCHours(0, 0, 0, 0);
      userDateFilter.created_at = {
        ...userDateFilter.created_at,
        gte: fromDate,
      };
    }

    if (data.to) {
      const toDate = new Date(data.to);
      toDate.setUTCHours(23, 59, 59, 999);
      userDateFilter.created_at = {
        ...userDateFilter.created_at,
        lte: toDate,
      };
    }
    const pacientes = await prisma.patient.findMany({
      where: {
        user: {
          ...userDateFilter,
          role: {
            role_name: rolesList.PACIENTE,
          },
        },
      },
      include: {
        user: {
          include: {
            role: true,
          },
        },
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      pacientes: pacientes,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { pacientes: [], ok: false };
  }
}

export async function organizationReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  organizations: Organization[];
  ok?: boolean;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        organizations: [],
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
    const organizations = await prisma.organization.findMany({
      where: whereClause,
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "organizaciones",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      organizations: organizations,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { organizations: [], ok: false };
  }
}

export async function odontogramReportData({
  odontogramId,
}: {
  odontogramId: number;
}): Promise<{
  odontogram?: Prisma.OdontogramGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
      odontogram_row: true;
    };
  }>;
  ok?: boolean;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const odontogram = await prisma.odontogram.findUnique({
      where: {
        id: odontogramId,
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
        odontogram_row: {
          orderBy: {
            created_at: "asc",
          },
        },
      },
    });
    if (!odontogram) {
      return {
        ok: false,
      };
    }
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "pacientes",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      odontogram: odontogram,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
