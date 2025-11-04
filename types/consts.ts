import { appointmentStatusList } from "./statusList";

export enum appointmentCost {
  COSTO_CITA = 50,
}
export enum appointmentDuration {
  MINUTOS = 30,
}
export enum appointmentAllowedTimeToConfirm {
  HOURS = 48,
}
export enum appointmentDefaultInstructions {
  INSTRUCCIONES = "Llegar puntual",
}

export const statusColorMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "red",
  [appointmentStatusList.STATUS_COMPLETADA]: "green",
  [appointmentStatusList.STATUS_CONFIRMADA]: "blue",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "gray",
  [appointmentStatusList.STATUS_PENDIENTE]: "yellow",
};
export const statusLabelMap: Record<string, string> = {
  [appointmentStatusList.STATUS_CANCELADA]: "Cancelada",
  [appointmentStatusList.STATUS_COMPLETADA]: "Completada",
  [appointmentStatusList.STATUS_CONFIRMADA]: "Confirmada",
  [appointmentStatusList.STATUS_NO_ASISTIDA]: "No Asistida",
  [appointmentStatusList.STATUS_PENDIENTE]: "Pendiente",
};
