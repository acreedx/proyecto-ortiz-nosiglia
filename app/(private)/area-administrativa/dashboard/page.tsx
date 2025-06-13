import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Grid, GridItem, Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";
import LineChart from "./components/LineChart";
import AppointmentStats from "./components/AppointmentStats";
import PieChart from "./components/PieChart";
import { ScatterChart } from "./components/ScatterPlot";
import BarChart from "./components/BarChart";

export default async function Page() {
  const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
  const values = [10, 20, 30, 25, 50];
  const labelsPie = ["Dentistas", "Médicos", "Asistentes", "Administrativos"];
  const dataPie = [10, 5, 3, 2];
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
              citas_canceladas: 1,
              citas_completadas: 1,
              citas_pendientes: 1,
              citas_totales: 1,
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
