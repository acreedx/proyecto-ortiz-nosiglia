import { ReactNode } from "react";
import { SideBarProvider } from "../../components/admin/side-bar-context";
import MarginHandler from "../../components/admin/margin-handler";
import Header from "../../components/admin/header";
import { Flex } from "@chakra-ui/react";
import SideBarSession from "../../components/admin/side-bar-session";
export default function ControlPanelLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SideBarProvider>
      <main className="min-h-screen flex flex-col text-black dark:text-white">
        <div className="flex flex-grow flex-row">
          <SideBarSession />
          <MarginHandler>
            <Header />
            <Flex className="flex flex-col w-full h-full p-4 md:p-6 2xl:p-10 bg-white dark:bg-boxdark ">
              {children}
            </Flex>
          </MarginHandler>
        </div>
      </main>
    </SideBarProvider>
  );
}
