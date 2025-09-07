"use server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma/prisma";
import { TGenerateReportSchema } from "../../../../../lib/zod/z-report-schemas";
import { Prisma } from "@prisma/client";
import { rolesList } from "../../../../../lib/nextauth/rolesList";
import {
  debtsStatusList,
  userStatusList,
} from "../../../../../types/statusList";
import { auth } from "../../../../../lib/nextauth/auth";
import { registerLog } from "../../../../../lib/logs/logger";

export async function accountsReportData({
  data,
}: {
  data: TGenerateReportSchema;
}): Promise<{
  deudas: Prisma.AccountGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
    };
  }>[];
  ok?: boolean;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        deudas: [],
        ok: false,
      };
    }
    const whereClause: {
      created_at?: {
        gte?: Date;
        lte?: Date;
      };
    } = {};
    if (data.from || data.to) {
      whereClause.created_at = {};
      if (data.from) {
        const fromDate = new Date(data.from);
        fromDate.setUTCHours(0, 0, 0, 0);
        whereClause.created_at.gte = fromDate;
      }
      if (data.to) {
        const toDate = new Date(data.to);
        toDate.setUTCHours(23, 59, 59, 999);
        whereClause.created_at.lte = toDate;
      }
    }
    const deudas = await prisma.account.findMany({
      where: {
        ...whereClause,
        patient: {
          user: {
            status: {
              in: [userStatusList.ACTIVO, userStatusList.NUEVO],
            },
            role: {
              role_name: rolesList.PACIENTE,
            },
          },
        },
      },
      include: {
        patient: {
          include: {
            user: true,
          },
        },
      },
      orderBy: {
        balance: "desc",
      },
    });
    await registerLog({
      type: "sistema",
      action: "crear informe",
      module: "deudas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    return {
      deudas: deudas,
      ok: true,
    };
  } catch (e) {
    console.log(e);
    return { deudas: [], ok: false };
  }
}

export async function completePayment({
  invoiceId,
  accountId,
}: {
  invoiceId: number;
  accountId: number;
}): Promise<{ ok: boolean }> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const updatedInvoice = await prisma.invoice.update({
      where: {
        id: invoiceId,
      },
      data: {
        status: userStatusList.INACTIVO,
        date_payment: new Date(),
      },
    });
    const checkAccount = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });
    if (!checkAccount) {
      return { ok: false };
    }
    await prisma.account.update({
      where: {
        id: accountId,
      },
      data: {
        balance: {
          decrement: updatedInvoice.total,
        },
        calculated_at: new Date(),
        billing_status:
          checkAccount.balance - updatedInvoice.total > 0
            ? debtsStatusList.CON_DEUDA
            : debtsStatusList.SIN_DEUDA,
      },
    });
    await registerLog({
      type: "sistema",
      action: "editar",
      module: "deudas",
      person_name: session.user.first_name + " " + session.user.last_name,
      person_role: session.user.role,
    });
    revalidatePath(`/area-administrativa/deudas/pagos/${accountId}`);
    return { ok: true };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}

export async function infoInvoice({
  invoiceId,
  accountId,
}: {
  invoiceId: number;
  accountId: number;
}): Promise<{
  ok: boolean;
  invoice?: Prisma.InvoiceGetPayload<{
    include: {
      account: {
        include: {
          patient: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }>;
}> {
  try {
    const session = await auth();
    if (!session) {
      return {
        ok: false,
      };
    }
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId,
        account_id: accountId,
      },
      include: {
        account: {
          include: {
            patient: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
    return {
      ok: true,
      invoice: invoice as Prisma.InvoiceGetPayload<{
        include: {
          account: {
            include: {
              patient: {
                include: {
                  user: true;
                };
              };
            };
          };
        };
      }>,
    };
  } catch (e) {
    console.log(e);
    return { ok: false };
  }
}
