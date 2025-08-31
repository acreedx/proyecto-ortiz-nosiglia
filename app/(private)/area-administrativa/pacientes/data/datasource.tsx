/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "../../../../../lib/prisma/prisma";
import { rolesList } from "../../../../../lib/nextauth/rolesList";

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

// Convierte "patient.allergies" => { patient: { allergies: {...} } }
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

// Construye el where para filtros
function buildPatientFilter(filterModel?: FilterModel) {
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

// Construye orderBy para columnas anidadas
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

export async function getPatients({
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

  const filters = buildPatientFilter(filterModel);

  const where = {
    role: { role_name: rolesList.PACIENTE },
    ...filters,
  };

  const orderBy = buildOrderBy(sortModel);

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take,
      where,
      include: {
        role: true,
        patient: {
          include: {
            emergency_contact: true,
          },
        },
      },
      orderBy,
    }),
    prisma.user.count({ where }),
  ]);

  return { rows, total };
}
