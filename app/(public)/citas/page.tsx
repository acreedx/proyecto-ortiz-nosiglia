import { Flex, Link } from "@chakra-ui/react";
import { auth } from "../../../lib/nextauth/auth";
import { rolesList } from "../../../lib/nextauth/rolesList";
import Banner from "../../../components/index/banner";
import { prisma } from "../../../lib/prisma/prisma";
import AppointmentsSection from "./sections/appointments-section";
import { userStatusList } from "../../../types/statusList";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session || !session.user)
    return (
      <main className="rounded-sm border border-stroke bg-white shadow-default flex-grow">
        <div className="flex flex-wrap items-center ">
          <Banner />
          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex flex-col items-center justify-center">
            <div className="text-center w-full px-8 py-4">
              Inicia sesión para reservar una cita
            </div>
            <Link href="/login" colorPalette={"orange"}>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </main>
    );
  const userId = await prisma.user.findUnique({
    where: {
      id: session.user.id_db,
    },
    select: {
      status: true,
      patient: {
        select: {
          id: true,
        },
      },
    },
  });
  if (!userId || !userId.patient) {
    return <main className="flex-grow p-4">No encontrado</main>;
  }
  if (userId.status === userStatusList.NUEVO) redirect("/cambio-de-password");
  const appointments = await prisma.appointment.findMany({
    where: {
      patient_id: userId.patient.id,
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

  const doctores = await prisma.user.findMany({
    where: {
      status: {
        in: [userStatusList.ACTIVO, userStatusList.NUEVO],
      },
      role: {
        role_name: {
          in: [rolesList.DENTISTA, rolesList.MEDICO_TEMPORAL],
        },
      },
    },
  });

  return session.user.role === rolesList.PACIENTE ? (
    <main className="flex-grow p-4">
      <Flex direction={{ base: "column", md: "row" }} w="100%" gap={2}>
        <AppointmentsSection
          props={{
            appointments: appointments,
            doctors: doctores,
          }}
        />
      </Flex>
    </main>
  ) : (
    <main className="flex-grow p-4">
      Necesita ser un paciente para crear una cita
    </main>
  );
}
