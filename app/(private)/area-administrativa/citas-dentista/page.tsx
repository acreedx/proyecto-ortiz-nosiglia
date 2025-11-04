import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Heading } from "@chakra-ui/react";
import { auth } from "../../../../lib/nextauth/auth";
import { redirect } from "next/navigation";
import { userStatusList } from "../../../../types/statusList";
import { prisma } from "../../../../lib/prisma/prisma";
import { rolesList } from "../../../../lib/nextauth/rolesList";
import AppointmentsSection from "./sections/appointments-section";
import { statusColorMap, statusLabelMap } from "../../../../types/consts";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/login");
  const pacientes = await prisma.user.findMany({
    where: {
      status: {
        in: [userStatusList.ACTIVO, userStatusList.NUEVO],
      },
      role: {
        role_name: rolesList.PACIENTE,
      },
    },
    orderBy: {
      last_name: "asc",
    },
  });
  const usuario = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
    include: {
      staff: {
        include: {
          doctor: true,
        },
      },
    },
  });
  if (!usuario || !usuario.staff || !usuario.staff.doctor) {
    return <div>No encontrado</div>;
  }
  const appointments = await prisma.appointment.findMany({
    where: {
      doctor_id: usuario.staff.doctor.id,
    },
    orderBy: {
      programed_date_time: "desc",
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
      doctor: {
        include: {
          staff: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return (
    <main className="w-full flex flex-col h-full flex-grow">
      <BreadCrumb
        pageName={`Citas del dentista ${session.user.first_name} ${session.user.last_name}`}
      />
      <Heading>
        Citas del dentista {session.user.first_name} {session.user.last_name}
      </Heading>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "8px 0",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontWeight: 600 }}>Colores de la cita:</span>
        {Object.keys(statusColorMap).map((status) => (
          <div key={status} className="flex items-center gap-4 flex-wrap">
            <span
              style={{
                display: "inline-block",
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                backgroundColor: statusColorMap[status],
                border: "1px solid #ccc",
              }}
            />
            {/* Label */}
            <span style={{ fontSize: "0.9rem" }}>{statusLabelMap[status]}</span>
          </div>
        ))}
      </div>
      <AppointmentsSection
        props={{
          appointments: appointments,
          patients: pacientes,
        }}
      />
    </main>
  );
}
