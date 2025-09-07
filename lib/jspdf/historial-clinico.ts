/* eslint-disable @typescript-eslint/no-explicit-any */
import { CarePlan, Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import { treatmentStatusList, userStatusList } from "../../types/statusList";

export async function reporteHistorialPaciente({
  data,
}: {
  data: Prisma.UserGetPayload<{
    include: {
      patient: {
        include: {
          care_plan: true;
          appointment: true;
          encounter: true;
          emergency_contact: true;
          imaging_study: true;
          odontogram: {
            include: {
              odontogram_row: true;
            };
          };
          organization: true;
        };
      };
    };
  }>;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 34);
  doc.text(
    `Historial Clínico - ${data.first_name} ${data.last_name}`,
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
    `Fecha del reporte: ${new Date().toLocaleDateString()}, Hora: ${new Date()
      .getHours()
      .toString()
      .padStart(2, "0")}:${new Date()
      .getMinutes()
      .toString()
      .padStart(2, "0")}`,
    14,
    46
  );

  let currentY = 60;

  // Datos personales
  doc.setFont("helvetica", "bold");
  doc.text("Datos personales", 14, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 8;
  doc.text(`Nombre: ${data.first_name} ${data.last_name}`, 14, currentY);
  currentY += 6;
  doc.text(`Identificación: ${data.identification}`, 14, currentY);
  currentY += 6;
  doc.text(
    `Fecha de nacimiento: ${new Date(data.birth_date).toLocaleDateString()}`,
    14,
    currentY
  );
  currentY += 6;
  doc.text(`Correo: ${data.email}`, 14, currentY);
  currentY += 6;
  doc.text(`Teléfono: ${data.phone}`, 14, currentY);
  currentY += 6;
  doc.text(`Celular: ${data.mobile}`, 14, currentY);
  currentY += 6;
  doc.text(
    `Dirección: ${data.address_line}, ${data.address_city}`,
    14,
    currentY
  );
  currentY += 6;
  doc.text(
    `Seguro: ${
      data.patient?.organization ? data.patient.organization.name : "Ninguno"
    }`,
    14,
    currentY
  );

  // Antecedentes médicos
  currentY += 12;
  doc.setFont("helvetica", "bold");
  doc.text("Antecedentes médicos", 14, currentY);
  doc.setFont("helvetica", "normal");
  currentY += 8;
  doc.text(
    `Alergias: ${data.patient?.allergies || "No registradas"}`,
    14,
    currentY
  );
  currentY += 6;
  doc.text(
    `Precondiciones: ${data.patient?.preconditions || "No registradas"}`,
    14,
    currentY
  );

  // Contacto de emergencia
  if (data.patient?.emergency_contact) {
    currentY += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Contacto de emergencia", 14, currentY);
    doc.setFont("helvetica", "normal");
    currentY += 8;
    const ec = data.patient.emergency_contact;
    doc.text(`Nombre: ${ec.name}`, 14, currentY);
    currentY += 6;
    doc.text(`Relación: ${ec.relation}`, 14, currentY);
    currentY += 6;
    doc.text(`Teléfono: ${ec.phone}`, 14, currentY);
    currentY += 6;
    doc.text(`Celular: ${ec.mobile}`, 14, currentY);
    currentY += 6;
    doc.text(`Dirección: ${ec.address_line} ${ec.address_city}`, 14, currentY);
  }

  // Estudios de imagen
  if (data.patient?.imaging_study && data.patient.imaging_study.length > 0) {
    currentY += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Estudios de imagen", 14, currentY);
    doc.setFont("helvetica", "normal");

    const tableData = data.patient.imaging_study.map(
      (study: any, index: number) => [
        index + 1,
        study.description || "Sin descripción",
        study.created_at
          ? new Date(study.created_at).toLocaleDateString()
          : "-",
      ]
    ) as RowInput[];

    autoTable(doc, {
      head: [["#", "Descripción", "Fecha"]],
      body: tableData,
      startY: currentY + 6,
      theme: "grid",
      headStyles: {
        fillColor: [255, 87, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        textColor: [51, 51, 51],
      },
      alternateRowStyles: {
        fillColor: [255, 245, 235],
      },
      margin: { left: 14, right: 14 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // Encuentros
  if (data.patient?.encounter && data.patient.encounter.length > 0) {
    currentY += 12;
    doc.setFont("helvetica", "bold");
    doc.text("Atenciones realizadas", 14, currentY);
    doc.setFont("helvetica", "normal");

    const tableData = data.patient.encounter.map((appt: any, index: number) => [
      index + 1,
      appt.type,
      appt.reason,
      appt.specialty,
      appt.diagnosis,
      new Date(appt.performed_on).toLocaleDateString(),
    ]) as RowInput[];

    autoTable(doc, {
      head: [["#", "Tipo", "Motivo", "Especialidad", "Diagnóstico", "Fecha"]],
      body: tableData,
      startY: currentY + 6,
      theme: "grid",
      headStyles: {
        fillColor: [255, 87, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        textColor: [51, 51, 51],
      },
      margin: { left: 14, right: 14 },
    });
    currentY = (doc as any).lastAutoTable.finalY + 6;
  }

  // Tratamientos
  if (data.patient?.care_plan && data.patient.care_plan.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Tratamientos realizados", 14, currentY);
    doc.setFont("helvetica", "normal");

    const tableData = data.patient.care_plan.map(
      (t: CarePlan, index: number) => [
        index + 1,
        t.treatment_type,
        t.title,
        t.description,
        new Date(t.start_date).toLocaleDateString(),
        {
          [userStatusList.ACTIVO]: "Activo",
          [userStatusList.INACTIVO]: "Inactivo",
          [treatmentStatusList.COMPLETADO]: "Completado",
        }[t.status] ?? "—",
      ]
    ) as RowInput[];

    autoTable(doc, {
      head: [
        [
          "#",
          "Tipo de tratamiento",
          "Nombre",
          "Descripción",
          "Inicio",
          "Estado",
        ],
      ],
      body: tableData,
      startY: currentY + 6,
      theme: "grid",
      headStyles: {
        fillColor: [255, 87, 34],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        textColor: [51, 51, 51],
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Guardar PDF
  doc.save(`historial_paciente_${data.first_name}_${data.last_name}.pdf`);
}
