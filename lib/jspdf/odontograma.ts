import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

export async function reporteOdontograma({
  odontogram,
}: {
  odontogram: Prisma.OdontogramGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
      odontogram_row: true;
    };
  }>;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 34);
  doc.text(
    `Odontograma del paciente ${odontogram.patient.user.first_name} ${odontogram.patient.user.last_name}`,
    pageWidth / 2,
    16,
    { align: "center" }
  );
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Centro de Salud Ortiz Nosiglia", 14, 30);
  doc.text(
    "Dirección: Calle 15 de Calacoto, DiagnoSur piso 1, consultorio 108, La Paz, Bolivia",
    14,
    38
  );
  doc.text(
    `Fecha del reporte: ${new Date().toLocaleDateString()}, Hora: ${new Date().getHours().toString().padStart(2, "0")}:${new Date().getMinutes().toString().padStart(2, "0")}`,
    14,
    46
  );
  if (odontogram.odontogram_row.length > 0) {
    const tableData = odontogram.odontogram_row.map((rows, index) => [
      index + 1,
      rows.msc,
      rows.temp,
      rows.pieza,
      rows.fecha?.toLocaleDateString(),
      rows.diagnostico,
    ]) as RowInput[];
    autoTable(doc, {
      head: [["#", "Msc", "Temp", "Pieza", "Fecha", "Diagnóstico"]],
      body: tableData,
      startY: 54,
      theme: "grid",
      headStyles: {
        fillColor: [255, 87, 34],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        textColor: [51, 51, 51],
      },
      alternateRowStyles: {
        fillColor: [255, 245, 235],
      },
      margin: { left: 14, right: 14 },
    });
  }
  doc.save(
    `reporte_odontograma_${odontogram.patient.user.first_name}_${odontogram.patient.user.last_name}.pdf`
  );
}
