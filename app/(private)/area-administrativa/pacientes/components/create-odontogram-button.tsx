"use client";
import { IconButton } from "@chakra-ui/react";
import React from "react";
import { FaPrint } from "react-icons/fa";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";
import { reporteOdontograma } from "../../../../../lib/jspdf/odontograma";
import { odontogramReportData } from "../actions/operations";

export default function CreateOdontogramButton({
  odontogramId,
}: {
  odontogramId: number;
}) {
  const handleGenerateOdontogramReport = async () => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de generar este reporte?",
    });
    if (isConfirmed) {
      const res = await odontogramReportData({
        odontogramId: odontogramId,
      });
      if (res.ok && res.odontogram) {
        await reporteOdontograma({
          odontogram: res.odontogram,
        });
        toaster.create({
          description: "Reporte creado con éxito",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al generar el reporte",
          type: "error",
        });
      }
    }
  };
  return (
    <div className="flex justify-center">
      <IconButton
        colorPalette={"orange"}
        size={"md"}
        px={2}
        onClick={handleGenerateOdontogramReport}
      >
        <FaPrint color="orange" /> Imprimir
      </IconButton>
    </div>
  );
}
