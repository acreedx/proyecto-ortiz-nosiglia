/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SidebarDropdown = ({ item }: any) => {
  const pathname = usePathname();

  return (
    <>
      <ul className="flex flex-col duration-300">
        {item.map((item: any, index: number) => (
          <li key={index} className="w-full ">
            <Link
              href={item.route}
              className={`group relative flex items-center  gap-2.5  p-4 px-4 text-center font-medium text-white duration-300 ease-linear hover:bg-orange-700 hover:text-white ${
                pathname === item.route ? "bg-orange-700" : ""
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default SidebarDropdown;
