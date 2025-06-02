"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateImagingStudySchema,
  TCreateImagingStudySchema,
} from "../../../../../lib/zod/z-imaging-study-schemas";
import { fileUploader } from "../../../../../lib/firebase/file-uploader";
import { userStatusList } from "../../../../../types/statusList";
import { Files, Organization, Prisma } from "@prisma/client";
import {
  EditPatientSchema,
  TEditPatientSchema,
} from "../../../../../lib/zod/z-patient-schemas";
import {
  EditEmergencyContact,
  TEditEmergencyContact,
} from "../../../../../lib/zod/z-emergency-contact";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { rolesList } from "../../../../../lib/nextauth/rolesList";

export async function create({
  data,
  files,
}: {
  data: TCreateImagingStudySchema;
  files: File[];
}): Promise<{ ok: boolean }> {
  try {
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
    await prisma.imagingStudy.create({
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
    const tryParse = EditPatientSchema.safeParse(data);
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
        allergies: data.allergies,
        preconditions: data.preconditions,
        organization_id: data.organization_id,
      },
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
    return {
      odontogram: odontogram,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
