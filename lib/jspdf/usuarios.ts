import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import { TGenerateReportSchema } from "../zod/z-report-schemas";
import { timeFormatter } from "../../types/dateFormatter";
import autoTable, { RowInput } from "jspdf-autotable";
import { userStatusList } from "../../types/statusList";

export async function reporteUsuarios({
  data,
  usuarios,
}: {
  data: TGenerateReportSchema;
  usuarios: Prisma.UserGetPayload<{
    include: {
      role: true;
    };
  }>[];
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 34);
  doc.text("Reporte de usuarios", pageWidth / 2, 16, {
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
    `Fecha del reporte: ${new Date().toLocaleDateString()}, Hora: ${timeFormatter(new Date())}`,
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
  if (usuarios.length > 0) {
    const tableData = usuarios.map((usuario, index) => [
      index + 1,
      `${usuario.first_name} ${usuario.last_name || ""}`,
      usuario.identification,
      usuario.status === userStatusList.ACTIVO
        ? "activo"
        : usuario.status === userStatusList.INACTIVO
          ? "inactivo"
          : usuario.status === userStatusList.NUEVO
            ? "nuevo"
            : usuario.status === userStatusList.BLOQUEADO
              ? "bloqueado"
              : "-",
      usuario.phone || "N/A",
      usuario.email || "N/A",
      usuario.role.role_name,
      usuario.created_at?.toLocaleDateString(),
    ]) as RowInput[];
    autoTable(doc, {
      head: [
        [
          "#",
          "Nombre",
          "Identificación",
          "Estado",
          "Teléfono",
          "Correo Electrónico",
          "Rol",
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
  doc.save("reporte_usuarios.pdf");
}
