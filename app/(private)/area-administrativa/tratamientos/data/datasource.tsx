/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "../../../../../lib/prisma/prisma";
import {
  treatmentStatusList,
  userStatusList,
} from "../../../../../types/statusList";

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

function buildCarePlanFilter(filterModel: FilterModel | undefined) {
  const where: any = {};
  if (!filterModel) return where;
  if (filterModel.statusText?.filter) {
    const text = filterModel.statusText.filter;
    const statusMap: Record<string, string> = {
      Activo: userStatusList.ACTIVO,
      Inactivo: userStatusList.INACTIVO,
      Completado: treatmentStatusList.COMPLETADO,
    };

    const mappedStatus = statusMap[text] || null;
    if (mappedStatus) {
      where.status = mappedStatus;
    }
  }
  return where;
}

function buildOrderBy(sortModel?: SortModel) {
  if (!sortModel || sortModel.length === 0) return [{ created_at: "asc" }];

  return sortModel.map((s) => {
    let colId = s.colId;
    if (colId === "statusText") {
      colId = "status";
    }
    if (colId.includes(".")) {
      const nested: any = {};
      setNestedObject(nested, colId.split("."), s.sort);
      return nested;
    }
    return { [colId]: s.sort };
  });
}

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
