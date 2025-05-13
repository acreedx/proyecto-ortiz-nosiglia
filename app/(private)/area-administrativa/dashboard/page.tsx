import React from "react";
import BreadCrumb from "../../../../components/admin/breadcrumb";
import { Grid, GridItem, Heading } from "@chakra-ui/react";
import CanStaff from "../../../../lib/rbac/can-staff";
import LineChart from "./components/LineChart";
import AppointmentStats from "./components/AppointmentStats";

export default async function Page() {
  const labels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo"];
  const values = [10, 20, 30, 25, 50];
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
          gap={{ base: 4, md: 6, "2xl": 7.5 }}
        >
          <GridItem>
            <LineChart labels={labels} data={values} />
          </GridItem>
          <GridItem>
            <LineChart labels={labels} data={values} />
          </GridItem>
        </Grid>
      </main>
    </CanStaff>
  );
}
