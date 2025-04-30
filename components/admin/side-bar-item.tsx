/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import SidebarDropdown from "./side-bar-drop-down";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";

const SidebarItem = ({ item, pageName, setPageName }: any) => {
  const pathname = usePathname();
  const [isPageNameLikeItem, setIsPageNameLikeItem] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setIsPageNameLikeItem(pageName === item.label.toLowerCase());
  }, [pageName, item.label]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleClick = () => {
    const updatedPageName =
      pageName !== item.label.toLowerCase() ? item.label.toLowerCase() : "";
    setPageName(updatedPageName);
  };

  const isActive = (item: any) => {
    if (item.route === pathname) return true;
    if (item.children) {
      return item.children.some((child: any) => isActive(child));
    }
    return false;
  };

  const isItemActive = isActive(item);

  return (
    <li>
      <Link
        href={item.route}
        onClick={handleClick}
        className={`${
          isItemActive ? "bg-orange-600 dark:bg-meta-4 " : "bg-orange-600"
        } group relative flex items-center gap-2.5 px-4 py-3 font-medium text-white duration-300 ease-in-out hover:bg-orange-700 dark:hover:bg-meta-4`}
      >
        {item.icon}
        {item.label}
        {item.children &&
          (isPageNameLikeItem ? (
            <FaArrowUp className="absolute right-4 top-1/2 -translate-y-1/2 fill-current duration-200 ease-linear" />
          ) : (
            <FaArrowDown className="absolute right-4 top-1/2 -translate-y-1/2 fill-current duration-200 ease-linear" />
          ))}
      </Link>

      {item.children && hasMounted && (
        <div
          className={`transform overflow-hidden bg-orange-400 duration-300 ease-in-out ${
            isPageNameLikeItem ? "max-h-screen" : "hidden max-h-0"
          }`}
        >
          <SidebarDropdown item={item.children} />
        </div>
      )}
    </li>
  );
};

export default SidebarItem;
