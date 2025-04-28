import { ReactNode } from "react";

export default function ControlPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Puedes poner un sidebar aquí */}
      <aside className="w-64 bg-blue-800 text-white p-4">
        <h2 className="text-2xl font-bold mb-4">Menú</h2>
        <ul>
          <li>Pacientes</li>
          <li>Citas</li>
          <li>Historiales</li>
          {/* Agrega más opciones */}
        </ul>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
}
