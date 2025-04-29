import CanStaff from "../../../lib/rbac/can-staff";

export default function Page() {
  return (
    <CanStaff>
      <div>
        <h1 className="text-3xl font-bold">Panel de Control</h1>
        <p>Bienvenido al área de gestión clínica.</p>
      </div>
    </CanStaff>
  );
}
