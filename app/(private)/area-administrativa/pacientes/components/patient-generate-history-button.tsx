"use client";
import { Button } from "@chakra-ui/react";
import React from "react";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { patienHistoryReportData } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import { reporteHistorialPaciente } from "../../../../../lib/jspdf/historial-clinico";

export default function PatientGenerateHistoryButton({
  props,
}: {
  props: { patientId: string };
}) {
  return (
    <div className="flex items-center w-full justify-center">
      <Button
        colorPalette={"orange"}
        size={"md"}
        onClick={async () => {
          const isConfirmed = await mostrarAlertaConfirmacion({
            mensaje: "Quiere imprimir el historial del paciente?",
          });

          const res = await patienHistoryReportData({
            patientId: props.patientId,
          });
          if (res.ok) {
            await reporteHistorialPaciente({
              data: res.patientHistory!,
            });
            if (isConfirmed) {
              toaster.create({
                description: "Historial generado con éxito",
                type: "success",
              });
            }
          } else {
            toaster.create({
              description: "Error al generar el historial",
              type: "error",
            });
          }
        }}
      >
        Imprimir historial
      </Button>
    </div>
  );
}
