import { ReactNode } from "react";
import SideBarWrapper from "../../components/admin/side-bar-wrapper";

export default function ControlPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <main>
      <SideBarWrapper>{children}</SideBarWrapper>
    </main>
  );
}
