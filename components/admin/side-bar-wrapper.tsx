"use client";

import { useState } from "react";
import Sidebar from "./side-bar";

export default function SideBarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="flex">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div
        className={`relative flex flex-1 flex-col ${sidebarOpen ? "ml-72.5" : "ml-0"}`}
      >
        {/*<Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />*/}
        <div className="w-full p-4 md:p-6 2xl:p-10">{children}</div>
      </div>
    </div>
  );
}
