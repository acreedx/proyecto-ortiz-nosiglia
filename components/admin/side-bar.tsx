/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { menuOptions } from "../../types/side-bar-options";
import ClickOutside from "./click-outside";
import SidebarItem from "./side-bar-item";
import useLocalStorage from "../../hooks/useLocalStorage";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const [accessibleMenu, setAccessibleMenu] = useState(menuOptions);
  const [pageName, setPageName] = useLocalStorage("selectedMenu", "dashboard");
  //useEffect(() => {
  //  //if (
  //  //  session &&
  //  //  session.user &&
  //  //  "rol" in session.user &&
  //  //  session.user.rol.permissions
  //  //) {
  //  //  const userPermissions = session.user.rol.permissions.map((e) => {
  //  //    return e.code;
  //  //  });
  //  //
  //  //  const filteredMenu = menuOptions.map((section) => ({
  //  //    ...section,
  //  //    menuItems: section.menuItems
  //  //      .map((item) => ({
  //  //        ...item,
  //  //        children: item.children.filter(
  //  //          (child) =>
  //  //            userPermissions.includes(child.permission) ||
  //  //            child.permission === permissionsList.SIN_PERMISO,
  //  //        ),
  //  //      }))
  //  //      .filter((item) => item.children.length > 0),
  //  //  }));
  //  //  setAccessibleMenu(filteredMenu);
  //  //}
  //}, [session]);
  return (
    <ClickOutside onClick={() => {}}>
      <aside
        className={`shadow-gray-500/50 fixed left-0 top-0 z-20 flex h-screen w-72.5 flex-col overflow-y-hidden bg-slate-50 shadow-lg duration-300 ease-linear dark:bg-boxdark ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href={"/"}>
            <Image
              width={78}
              height={78}
              src={"/images/logo/logo.png"}
              alt="Ortiz Nosiglia Logo"
              priority
            />
          </Link>
        </div>

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear ">
          <nav className="mt-5 px-4 py-4 shadow-lg shadow-gray lg:mt-9 lg:px-2 ">
            {accessibleMenu.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem, menuIndex) => (
                    <SidebarItem
                      key={menuIndex}
                      item={menuItem}
                      pageName={pageName}
                      setPageName={setPageName}
                    />
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
