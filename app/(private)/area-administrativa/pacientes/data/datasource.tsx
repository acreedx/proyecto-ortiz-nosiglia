/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { rolesList } from "../../../../../lib/nextauth/rolesList";
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

// Convierte "patient.allergies" => { patient: { allergies: {...} } }
function setNestedFilter(obj: any, path: string[], value: any) {
  const [head, ...rest] = path;
  if (!head) return;
  if (rest.length === 0) {
    obj[head] = value;
  } else {
    obj[head] = obj[head] || {};
    setNestedFilter(obj[head], rest, value);
  }
}

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
        setNestedFilter(where, field.split("."), condition);
      } else {
        where[field] = condition;
      }
    }
  }
  return where;
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

  const where = {
    role: {
      role_name: rolesList.PACIENTE,
    },
    ...buildPatientFilter(filterModel),
  };
  let orderBy: any = { last_name: "asc" };
  if (sortModel && sortModel.length > 0) {
    orderBy = sortModel.map((s) => ({ [s.colId]: s.sort }));
  }

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
