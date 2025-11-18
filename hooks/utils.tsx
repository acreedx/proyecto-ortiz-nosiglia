import { Configuration } from "@prisma/client";

export function normalizarFecha(fecha: Date) {
  return new Date(
    fecha.getFullYear(),
    fecha.getMonth(),
    fecha.getDate(),
    fecha.getUTCHours(),
    fecha.getUTCMinutes()
  );
}

export const isTodayOrFuture = (date: Date) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  date.setUTCHours(0, 0, 0, 0);
  return date.getTime() >= today.getTime();
};

export function getUserColor(user: {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birth_date: Date;
  created_at: Date | null;
}): string {
  const str = `${user.id}-${user.first_name}-${user.last_name}-${user.email}-${user.birth_date?.toISOString() || ""}-${user.created_at?.toISOString() || ""}`;

  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);
  let h = hash % 360;
  const s = 65 + (hash % 10);
  const l = 50;

  const forbiddenHues = [0, 120, 210, 50, 0];

  const minDistance = 25;

  for (const forbidden of forbiddenHues) {
    const diff = Math.abs(h - forbidden);
    if (diff < minDistance || 360 - diff < minDistance) {
      h = (h + minDistance * 2) % 360;
    }
  }

  return `hsl(${h}, ${s}%, ${l}%)`;
}
export function horaAFechaUTC(hora: string): Date {
  if (!hora) return null as unknown as Date;
  const [h, m] = hora.split(":");
  return new Date(Date.UTC(2025, 0, 1, Number(h), Number(m), 0));
}

export const isWorkingDay = (config: Configuration, date: Date): boolean => {
  const dayIndex = date.getUTCDay();
  const dayMap = [
    config.sunday,
    config.monday,
    config.tuesday,
    config.wednesday,
    config.thursday,
    config.friday,
    config.saturday,
  ];
  return dayMap[dayIndex];
};

export function generarIntervalos(config: Configuration | null): string[] {
  const horarios: string[] = [];
  if (!config) {
    for (let h = 8; h < 17; h++) {
      horarios.push(`${String(h).padStart(2, "0")}:00`);
      horarios.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horarios;
  }
  const open = config.openHour;
  const close = config.closeHour;
  const actual = open;

  while (actual < close) {
    const horas = actual.getUTCHours().toString().padStart(2, "0");
    const minutos = actual.getUTCMinutes().toString().padStart(2, "0");
    horarios.push(`${horas}:${minutos}`);
    actual.setMinutes(actual.getMinutes() + 30);
  }

  return horarios;
}
