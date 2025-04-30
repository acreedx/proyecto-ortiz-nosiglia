import Swal from "sweetalert2";

export async function mostrarAlertaConfirmacion({
  mensaje,
}: {
  mensaje: string;
}): Promise<boolean> {
  return Swal.fire({
    title: "Confirmación",
    text: mensaje,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, hazlo!",
    cancelButtonText: "No, cancelar",
    confirmButtonColor: "#28a745",
    cancelButtonColor: "#dc3545",
  }).then((result) => {
    return result.isConfirmed;
  });
}

export function mostrarAlertaExito({ mensaje }: { mensaje: string }) {
  Swal.fire({
    title: "Éxito",
    text: mensaje,
    icon: "success",
    confirmButtonText: "Aceptar",
    confirmButtonColor: "#28a745",
  });
}

export function mostrarAlertaError({ mensaje }: { mensaje: string }) {
  Swal.fire({
    title: "Error",
    text: mensaje,
    icon: "error",
    confirmButtonColor: "#28a745",
  });
}
