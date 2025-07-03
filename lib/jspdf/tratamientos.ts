import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import { TGenerateReportSchema } from "../zod/z-report-schemas";
import autoTable, { RowInput } from "jspdf-autotable";
import { userStatusList } from "../../types/statusList";

export async function reporteTratamientos({
  data,
  treatments,
}: {
  data: TGenerateReportSchema;
  treatments: Prisma.CarePlanGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
    };
  }>[];
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 34);
  doc.text("Reporte de tratamientos", pageWidth / 2, 16, {
    align: "center",
  });
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
  if (data.from || data.to) {
    doc.text(
      `Período: ${
        data.from
          ? "Desde " +
            new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })
              .format(new Date(data.from))
              .toString() +
            " "
          : ""
      } ${
        data.to
          ? "hasta " +
            new Intl.DateTimeFormat("es-ES", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
              timeZone: "UTC",
            })
              .format(new Date(data.to))
              .toString()
          : ""
      }`,
      14,
      54
    );
  } else {
    doc.text("Período: Todos los registros", 14, 54);
  }
  if (treatments.length > 0) {
    const tableData = treatments.map((treatment, index) => [
      index + 1,
      treatment.treatment_type,
      treatment.title,
      treatment.start_date.toLocaleDateString(),
      treatment.estimated_appointments,
      treatment.cost,
      treatment.patient.user.first_name +
        " " +
        treatment.patient.user.last_name,
      treatment.patient.user.status === userStatusList.ACTIVO
        ? "activo"
        : treatment.status === userStatusList.INACTIVO
          ? "inactivo"
          : treatment.status === userStatusList.NUEVO
            ? "nuevo"
            : treatment.status === userStatusList.BLOQUEADO
              ? "bloqueado"
              : "-",
      treatment.created_at?.toLocaleDateString(),
    ]) as RowInput[];
    autoTable(doc, {
      head: [
        [
          "#",
          "Tipo",
          "Título",
          "Fecha de inicio",
          "Citas estimadas",
          "Costo",
          "Paciente",
          "Estado",
          "Fecha de Registro",
        ],
      ],
      body: tableData,
      startY: 62,
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
  doc.save("reporte_tratamientos.pdf");
}
