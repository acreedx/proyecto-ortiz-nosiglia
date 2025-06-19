"use client";
import React from "react";
import CardStats from "./CardStats";
import { Grid } from "@chakra-ui/react";

export default function AppointmentStats({
  props,
}: {
  props: {
    citas_canceladas: number;
    citas_completadas: number;
    citas_confirmadas: number;
    citas_no_asitidas: number;
    citas_pendientes: number;
    citas_totales: number;
  };
}) {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(2, 1fr)",
        xl: "repeat(4, 1fr)",
      }}
      gap={{ base: 4, md: 6, "2xl": 7.5 }}
      justifyItems="center"
    >
      <CardStats label="Citas canceladas" value={props.citas_canceladas} />
      <CardStats label="Citas completadas" value={props.citas_completadas} />
      <CardStats label="Citas confirmadas" value={props.citas_confirmadas} />
      <CardStats label="Citas no asistidas" value={props.citas_no_asitidas} />
      <CardStats label="Citas pendientes" value={props.citas_pendientes} />
      <CardStats label="Citas totales" value={props.citas_totales} />
    </Grid>
  );
}
