import { Box, Flex, Heading } from "@chakra-ui/react";
import CalendarioDeCitas from "./components/calendario-de-citas";
import AppointmentAccordion from "./components/appointments-accordion";
import { auth } from "../../../lib/nextauth/auth";
import { rolesList } from "../../../lib/nextauth/rolesList";
import Banner from "../../../components/index/banner";

export default async function Page() {
  const session = await auth();
  if (!session)
    return (
      <main className="rounded-sm border border-stroke bg-white shadow-default flex-grow">
        <div className="flex flex-wrap items-center ">
          <Banner />
          <div className="w-full border-stroke xl:w-1/2 xl:border-l-2 p-6 h-full flex items-center justify-center">
            <div className="text-center w-full px-8 py-4">
              Inicia sesión para crear reservar una cita
            </div>
          </div>
        </div>
      </main>
    );
  {
    return (
      session.user.role === rolesList.PACIENTE && (
        <main className="flex-grow p-4">
          <Flex direction={{ base: "column", md: "row" }} w="100%" gap={2}>
            <div className="w-full md:w-1/2">
              <Heading>Pantalla de citas</Heading>
              <Box p={1}>
                <AppointmentAccordion />
              </Box>
            </div>
            <div className="flex flex-col w-full h-fit md:w-1/2 ">
              <CalendarioDeCitas />
            </div>
          </Flex>
        </main>
      )
    );
  }
}
