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
  type?: "sistema" | "configuración" | "acción" | "autenticación" | "acceso";
  action:
    | "leer"
    | "crear"
    | "editar"
    | "deshabilitar"
    | "restaurar"
    | "inicio de sesion"
    | "cerrado de sesion"
    | "cambio de password"
    | "recuperar password"
    | "crear informe";
  severity?: "baja" | "media" | "alta";
  outcome?: "éxito" | "error" | "desconocido";
  module:
    | "pacientes"
    | "organizaciones"
    | "citas"
    | "citas por dentista"
    | "usuarios"
    | "tipos de tratamientos"
    | "tratamientos"
    | "deudas"
    | "aplicación móvil"
    | "página web"
    | "personal"
    | "roles";
  detail?: string;
  requestor?: boolean;
  occurred_date_time?: Date;
  network?: string;
  person_name: string;
  person_role: string;
  staff_id?: number;
  patient_id?: number;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e);
  }
}
