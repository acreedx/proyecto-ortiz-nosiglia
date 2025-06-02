import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import { TGenerateReportSchema } from "../zod/z-report-schemas";
import { timeFormatter } from "../../types/dateFormatter";
import autoTable, { RowInput } from "jspdf-autotable";
import { appointmentStatusList } from "../../types/statusList";

export async function reporteCitas({
  data,
  appointments,
}: {
  data: TGenerateReportSchema;
  appointments: Prisma.AppointmentGetPayload<{
    include: {
      patient: {
        include: {
          user: true;
        };
      };
      doctor: {
        include: {
          staff: {
            include: {
              user: true;
            };
          };
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
  doc.text("Reporte de citas", pageWidth / 2, 16, { align: "center" });
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
  if (appointments.length > 0) {
    const tableData = appointments.map((appointment, index) => [
      index + 1,
      appointment.scheduled_on.toLocaleDateString(),
      appointment.programed_date_time.toLocaleDateString(),
      timeFormatter(appointment.programed_date_time),
      appointment.specialty,
      appointment.patient.user.first_name +
        " " +
        appointment.patient.user.last_name,
      appointment.doctor.staff.user.first_name +
        " " +
        appointment.doctor.staff.user.last_name,
      appointment.status === appointmentStatusList.STATUS_CANCELADA
        ? "cancelada"
        : appointment.status === appointmentStatusList.STATUS_COMPLETADA
          ? "completada"
          : appointment.status === appointmentStatusList.STATUS_CONFIRMADA
            ? "confirmada"
            : appointment.status === appointmentStatusList.STATUS_NO_ASISTIDA
              ? "no asistida"
              : appointment.status === appointmentStatusList.STATUS_PENDIENTE
                ? "pendiente"
                : "-",
      appointment.created_at?.toLocaleDateString(),
    ]) as RowInput[];
    autoTable(doc, {
      head: [
        [
          "#",
          "Programado en",
          "Fecha",
          "Hora",
          "Especialidad",
          "Paciente",
          "Dentista",
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
  doc.save("reporte_citas.pdf");
}
