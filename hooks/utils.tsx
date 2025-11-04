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

  const h = hash % 360;
  const s = 70 + (hash % 15);
  const l = 45 + (hash % 10);
  return `hsl(${h}, ${s}%, ${l}%)`;
}
