import BreadCrumb from "../../../components/admin/breadcrumb";
import CanStaff from "../../../lib/rbac/can-staff";

export default function Page() {
  return (
    <CanStaff>
      <BreadCrumb pageName="Inicio" />
      <div className="pt-2">
        <h1 className="text-3xl font-bold">Área aministrativa</h1>
        <p>
          Bienvenido al área de gestión clínica, acceso solo para el personal
          autorizado.
        </p>
      </div>
    </CanStaff>
  );
}
