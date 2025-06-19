import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Grid, GridItem, Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";
import LineChart from "./components/LineChart";
import AppointmentStats from "./components/AppointmentStats";
import PieChart from "./components/PieChart";
import { ScatterChart } from "./components/ScatterPlot";
import BarChart from "./components/BarChart";
import { prisma } from "../../../../lib/prisma/prisma";
import { appointmentStatusList } from "../../../../types/statusList";
import { rolesList } from "../../../../lib/nextauth/rolesList";

export default async function Page() {
  const appointments = await prisma.appointment.findMany();
  //primer gráfico
  const datosCitas = {
    citas_canceladas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_CANCELADA
    ).length,
    citas_completadas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_COMPLETADA
    ).length,
    citas_confirmadas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_CONFIRMADA
    ).length,
    citas_no_asistidas: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_NO_ASISTIDA
    ).length,
    citas_pendientes: appointments.filter(
      (e) => e.status === appointmentStatusList.STATUS_PENDIENTE
    ).length,
    citas_totales: appointments.length,
  };
  //segundo gráfico
  const labels = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const values = [
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 0)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 1)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 2)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 3)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 4)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 5)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 6)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 7)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 8)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 9)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 10)
      .length,
    appointments.filter((e) => e.programed_date_time.getUTCMonth() === 11)
      .length,
  ];
  //tercer gráfico
  const usuarios = await prisma.user.findMany({
    include: {
      role: true,
    },
  });
  const labelsPie = [
    "Administrativos",
    "Dentistas",
    "Enfermeros",
    "Médicos temporales",
    "Pacientes",
    "Secretarios",
    "Otros roles",
  ];
  const dataPie = [
    usuarios.filter((e) => e.role.role_name === rolesList.ADMINISTRADOR).length,
    usuarios.filter((e) => e.role.role_name === rolesList.DENTISTA).length,
    usuarios.filter((e) => e.role.role_name === rolesList.ENFERMERO).length,
    usuarios.filter((e) => e.role.role_name === rolesList.MEDICO_TEMPORAL)
      .length,
    usuarios.filter((e) => e.role.role_name === rolesList.PACIENTE).length,
    usuarios.filter((e) => e.role.role_name === rolesList.SECRETARIO).length,
    usuarios.filter(
      (e) =>
        e.role.role_name !== rolesList.ADMINISTRADOR &&
        e.role.role_name !== rolesList.DENTISTA &&
        e.role.role_name !== rolesList.ENFERMERO &&
        e.role.role_name !== rolesList.MEDICO_TEMPORAL &&
        e.role.role_name !== rolesList.PACIENTE &&
        e.role.role_name !== rolesList.SECRETARIO
    ).length,
  ];
  //cuarto gráfico
  const puntos = [
    { x: 1, y: 3 },
    { x: 2, y: 7 },
    { x: 3, y: 4 },
    { x: 4, y: 8 },
    { x: 5, y: 5 },
  ];
  const labelsBars = ["Dentistas", "Médicos", "Asistentes", "Administrativos"];
  const dataBars = [10, 5, 3, 2];
  return (
    <CanStaff>
      <main className="w-full flex flex-col h-full flex-grow">
        <BreadCrumb pageName="Panel de control" />
        <div className="flex flex-row w-full items-center justify-between">
          <Heading>Dashboard</Heading>
        </div>
        <section className="mt-4">
          <AppointmentStats
            props={{
              citas_canceladas: datosCitas.citas_canceladas,
              citas_completadas: datosCitas.citas_completadas,
              citas_confirmadas: datosCitas.citas_confirmadas,
              citas_no_asitidas: datosCitas.citas_no_asistidas,
              citas_pendientes: datosCitas.citas_pendientes,
              citas_totales: datosCitas.citas_totales,
            }}
          />
        </section>
        <Grid
          mt={4}
          templateColumns={{ base: "1fr", xl: "repeat(2, 1fr)" }}
          gapY={{ base: 6, md: 8, "2xl": 10 }}
          gapX={{ base: 4, md: 6, "2xl": 7.5 }}
          justifyItems={"center"}
        >
          <GridItem w={"full"} justifyItems={"center"}>
            <LineChart labels={labels} data={values} />
          </GridItem>
          <GridItem
            h={"400px"}
            w={"full"}
            justifyItems={"center"}
            alignContent={"center"}
          >
            <PieChart labels={labelsPie} data={dataPie} />
          </GridItem>
          <GridItem
            w={"full"}
            justifyItems={"center"}
            alignContent={"center"}
            h={"400px"}
          >
            <ScatterChart data={puntos} />
          </GridItem>
          <GridItem
            w={"full"}
            justifyItems={"center"}
            alignContent={"center"}
            h={"400px"}
          >
            <BarChart labels={labelsBars} data={dataBars} />
          </GridItem>
        </Grid>
      </main>
    </CanStaff>
  );
}
