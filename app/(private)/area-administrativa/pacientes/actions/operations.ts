"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import {
  CreateImagingStudySchema,
  TCreateImagingStudySchema,
} from "../../../../../lib/zod/z-imaging-study-schemas";
import { fileUploader } from "../../../../../lib/firebase/file-uploader";
import { userStatusList } from "../../../../../types/statusList";
import { files } from "@prisma/client";
import {
  EditPatientSchema,
  TEditPatientSchema,
} from "../../../../../lib/zod/z-patient-schemas";
import {
  EditEmergencyContact,
  TEditEmergencyContact,
} from "../../../../../lib/zod/z-emergency-contact";

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
    const uploadedFiles: files[] = [];
    for (const file of files) {
      const url = await fileUploader(file);
      uploadedFiles.push({
        status: userStatusList.ACTIVO,
        media: url,
      } as files);
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
