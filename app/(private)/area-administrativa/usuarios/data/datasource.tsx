/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "../../../../../lib/prisma/prisma";

type FilterModel = Record<
  string,
  {
    filterType: string;
    type?: string;
    filter?: string;
  }
>;

type SortModel = {
  colId: string;
  sort: "asc" | "desc";
}[];

// Convierte "role.role_name" => { role: { role_name: {...} } }
function setNestedObject(obj: any, path: string[], value: any) {
  const [head, ...rest] = path;
  if (!head) return;
  if (rest.length === 0) {
    obj[head] = value;
  } else {
    obj[head] = obj[head] || {};
    setNestedObject(obj[head], rest, value);
  }
}

// Construye el where a partir de los filtros de AgGrid
function buildUserFilter(filterModel?: FilterModel) {
  if (!filterModel) return {};

  const where: any = {};
  for (const [field, filter] of Object.entries(filterModel)) {
    if (filter.filterType === "text" && filter.filter) {
      let condition: any;
      if (filter.type === "contains") {
        condition = { contains: filter.filter, mode: "insensitive" };
      } else if (filter.type === "equals") {
        condition = { equals: filter.filter };
      }

      if (field.includes(".")) {
        setNestedObject(where, field.split("."), condition);
      } else {
        where[field] = condition;
      }
    }
  }
  return where;
}

// Construye orderBy para Prisma desde sortModel de AgGrid
function buildOrderBy(sortModel?: SortModel) {
  if (!sortModel || sortModel.length === 0) return [{ last_name: "asc" }];

  return sortModel.map((s) => {
    if (s.colId.includes(".")) {
      const nested: any = {};
      setNestedObject(nested, s.colId.split("."), s.sort);
      return nested;
    }
    return { [s.colId]: s.sort };
  });
}

// Acción para obtener usuarios con scroll infinito
export async function getUsers({
  startRow,
  endRow,
  filterModel,
  sortModel,
}: {
  startRow: number;
  endRow: number;
  filterModel?: FilterModel;
  sortModel?: SortModel;
}) {
  const take = endRow - startRow;
  const skip = startRow;

  const filters = buildUserFilter(filterModel);
  const orderBy = buildOrderBy(sortModel);

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      where: filters,
      include: {
        role: true,
      },
      orderBy,
    }),
    prisma.user.count({ where: filters }),
  ]);

  return { rows, total };
}
