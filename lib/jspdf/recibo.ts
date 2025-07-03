import { Prisma } from "@prisma/client";
import jsPDF from "jspdf";
import { userStatusList } from "../../types/statusList";

export async function reporteRecibo({
  data,
}: {
  data: Prisma.InvoiceGetPayload<{
    include: {
      account: {
        include: {
          patient: {
            include: {
              user: true;
            };
          };
        };
      };
    };
  }>;
}) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(255, 87, 34);
  doc.text("Recibo", pageWidth / 2, 16, { align: "center" });
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
  // Datos del paciente
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Paciente", 14, 60);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Nombre: ${data.account.patient?.user.first_name} ${data.account.patient?.user.last_name}`,
    14,
    68
  );
  doc.text(`CI: ${data.account.patient?.user.identification}`, 14, 76);
  doc.text(`Nacimiento: ${data.account.patient?.user.identification}`, 14, 84);
  doc.text(`Teléfono: ${data.account.patient?.user.identification}`, 14, 92);
  doc.text(
    `Dirección: ${data.account.patient?.user.address_line}, ${data.account.patient?.user.address_city}`,
    14,
    100
  );

  // Datos de la factura
  doc.setFont("helvetica", "bold");
  doc.text("Datos del Recibo", 14, 114);
  doc.setFont("helvetica", "normal");
  doc.text(`Tipo: ${data.type}`, 14, 122);
  doc.text(`Total: Bs. ${data.total.toFixed(2)}`, 14, 130);
  doc.text(
    `Estado de la deuda: ${data.status === userStatusList.ACTIVO ? "Pendiente" : data.status === userStatusList.INACTIVO ? "Pagado" : "-"} `,
    14,
    138
  );
  doc.text(`Nota: ${data.note || "Ninguna"}`, 14, 146);

  doc.text(
    `Fecha de emisión: ${new Date(data.date_issued).toLocaleDateString()}`,
    14,
    154
  );
  if (data.date_payment) {
    doc.text(
      `Fecha del pago: ${new Date(data.date_payment).toLocaleDateString()}`,
      14,
      162
    );
  }
  doc.save(
    `recibo_${data.account.patient?.user.first_name}_${data.account.patient?.user.last_name}_${data.date_issued.toLocaleDateString()}.pdf`
  );
}
