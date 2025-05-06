import { prisma } from "../prisma/prisma";

export async function registerLog({
  type = "sistema",
  action,
  severity = "baja",
  outcome = "éxito",
  module,
  detail = "No hay detalles",
  requestor = false,
  occurred_date_time = new Date(),
  network = "Dirección IP no proporcionada",
  person_name,
  person_role,
  staff_id,
  patient_id,
}: {
  type: string;
  action: string;
  severity: string;
  outcome: string;
  module: string;
  detail: string;
  requestor: boolean;
  occurred_date_time: Date;
  network: string;
  person_name: string;
  person_role: string;
  staff_id: number;
  patient_id: number;
}) {
  try {
    await prisma.auditEvents.create({
      data: {
        type: type,
        action: action,
        severity: severity,
        outcome: outcome,
        module: module,
        detail: detail,
        requestor: requestor,
        occurred_date_time: occurred_date_time,
        network: network,
        person_name: person_name,
        person_role: person_role,
        staff_id: staff_id,
        patient_id: patient_id,
      },
    });
  } catch (e: any) {
    console.log(e);
  }
}
