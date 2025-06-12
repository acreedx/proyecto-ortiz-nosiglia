"use client";
import { createContext, useContext, useState } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SideBarContext = createContext<any>(null);

export const SideBarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <SideBarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SideBarContext.Provider>
  );
};

export const useSidebar = () => useContext(SideBarContext);
