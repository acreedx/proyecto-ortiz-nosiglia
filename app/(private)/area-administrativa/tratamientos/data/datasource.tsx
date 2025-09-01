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

// Convierte campos anidados tipo "patient.user.first_name"
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

// Construcción de filtros a partir de AgGrid
function buildCarePlanFilter(filterModel?: FilterModel) {
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

// Construcción de orderBy para Prisma
function buildOrderBy(sortModel?: SortModel) {
  if (!sortModel || sortModel.length === 0) return [{ created_at: "asc" }];

  return sortModel.map((s) => {
    if (s.colId.includes(".")) {
      const nested: any = {};
      setNestedObject(nested, s.colId.split("."), s.sort);
      return nested;
    }
    return { [s.colId]: s.sort };
  });
}

// Acción para AgGrid Infinite Row Model
export async function getCarePlans({
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

  const filters = buildCarePlanFilter(filterModel);
  const orderBy = buildOrderBy(sortModel);

  const [rows, total] = await Promise.all([
    prisma.carePlan.findMany({
      skip,
      take,
      where: filters,
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
      orderBy,
    }),
    prisma.carePlan.count({ where: filters }),
  ]);

  return { rows, total };
}
