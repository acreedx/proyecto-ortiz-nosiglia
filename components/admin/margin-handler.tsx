"use client";

import { ReactNode } from "react";
import { useSidebar } from "./side-bar-context";

export default function MarginHandler({ children }: { children: ReactNode }) {
  const { sidebarOpen } = useSidebar();
  return (
    <div
      className={`relative flex flex-1 flex-col ${sidebarOpen ? "ml-72.5" : "ml-0"}`}
    >
      {children}
    </div>
  );
}
