"use client";
import React from "react";
import { statusColorMap, statusLabelMap } from "../../../../../types/consts";

function AppointmentsColors() {
  return (
    <div className="flex items-center gap-4 px-2 py-0 flex-wrap">
      <span style={{ fontWeight: 600 }}>Colores de la cita:</span>
      {Object.keys(statusColorMap).map((status) => (
        <div key={status} className="flex items-center gap-4 flex-wrap">
          <span
            className="inline-block w-4 h-4"
            style={{
              borderRadius: "50%",
              backgroundColor: statusColorMap[status],
              border: "1px solid #ccc",
            }}
          />
          {/* Label */}
          <span style={{ fontSize: "0.9rem" }}>{statusLabelMap[status]}</span>
        </div>
      ))}
    </div>
  );
}

export default AppointmentsColors;
