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

export async function getAuditEvents({
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};
  if (filterModel) {
    for (const [field, filter] of Object.entries(filterModel)) {
      if (filter.filterType === "text") {
        if (filter.type === "contains" && filter.filter) {
          where[field] = { contains: filter.filter, mode: "insensitive" };
        } else if (filter.type === "equals" && filter.filter) {
          where[field] = { equals: filter.filter };
        }
      }
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { occurred_date_time: "asc" };
  if (sortModel && sortModel.length > 0) {
    orderBy = sortModel.map((s) => ({
      [s.colId]: s.sort,
    }));
  }

  const [rows, total] = await Promise.all([
    prisma.auditEvents.findMany({
      skip,
      take,
      where,
      orderBy,
    }),
    prisma.auditEvents.count({ where }),
  ]);

  return {
    rows,
    total,
  };
}
