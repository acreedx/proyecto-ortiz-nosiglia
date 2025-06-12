/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Accordion, Icon, Span } from "@chakra-ui/react";
import { Session } from "next-auth";

const SidebarItem = ({
  item,
  pageName,
  setPageName,
  session,
}: {
  item: any;
  pageName: any;
  setPageName: any;
  session: Session;
}) => {
  const pathname = usePathname();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isItemActive = isActive(item);

  return (
    <li>
      <Accordion.Root collapsible>
        <Accordion.Item value={item.pageName} bgColor={"orange.600"}>
          <Accordion.ItemTrigger px={4} py={3} onClick={handleClick}>
            <Icon fontSize="lg">{item.icon}</Icon>
            <Span flex="1" className="text-white">
              {item.label}
            </Span>
            <Accordion.ItemIndicator color={"white"} />
          </Accordion.ItemTrigger>
          <Accordion.ItemContent bgColor={"orange.400"} rounded={0} p={0}>
            {item.children && hasMounted && (
              <div
                className={`transform overflow-hidden bg-orange-400 duration-150 ease-in-out`}
              >
                <Accordion.ItemBody p={0}>
                  <ul>
                    {item.children.map(
                      (
                        child: {
                          label: string;
                          route: string;
                          permissionCode: string[];
                        },
                        index: number
                      ) =>
                        child.permissionCode.some((code) =>
                          session.user.permissions.some(
                            (permission) => permission.code === code
                          )
                        ) && (
                          <li key={index} className="w-full">
                            <Link
                              href={child.route}
                              className={`relative flex items-center py-3 px-4 text-center font-medium text-white duration-150 ease-linear hover:bg-orange-700 ${
                                pathname === child.route ? "bg-orange-700" : ""
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        )
                    )}
                  </ul>
                </Accordion.ItemBody>
              </div>
            )}
          </Accordion.ItemContent>
        </Accordion.Item>
      </Accordion.Root>
    </li>
  );
};

export default SidebarItem;
