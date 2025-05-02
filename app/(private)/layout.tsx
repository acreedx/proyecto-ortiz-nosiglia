import { ReactNode } from "react";
import { SideBarProvider } from "../../components/admin/side-bar-context";
import Sidebar from "../../components/admin/side-bar";
import MarginHandler from "../../components/admin/margin-handler";
import Header from "../../components/admin/header";

export default function ControlPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SideBarProvider>
      <main>
        <div className="flex">
          <Sidebar />
          <MarginHandler>
            <Header />
            <div className="w-full p-4 md:p-6 2xl:p-10">{children}</div>
          </MarginHandler>
        </div>
      </main>
    </SideBarProvider>
  );
}
