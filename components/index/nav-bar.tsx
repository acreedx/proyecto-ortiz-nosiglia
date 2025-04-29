"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Button, Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import NavBarLink from "./nav-bar-link";
import { HiMenu, HiX } from "react-icons/hi";
import { Session } from "next-auth";
import { rolesList } from "../../lib/nextauth/rolesList";
import UserDrawer from "./user-drawer";

export default function NavBar({ session }: { session: Session | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const setMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <nav className="border-b-1 sticky flex w-full flex-col justify-center md:flex-row">
      <Button
        className="absolute right-4 top-4 z-10 md:hidden"
        onClick={setMenu}
      >
        {isMenuOpen ? (
          <HiX size={24} color="orange" />
        ) : (
          <HiMenu size={24} color="orange" />
        )}
      </Button>
      <ul className="m-0 mb-0 flex w-full list-none flex-col items-center p-0 py-2 align-middle md:flex-row  md:items-stretch md:justify-around">
        <div className="flex flex-col items-center md:flex-row ">
          <Link
            as={NextLink}
            href={"/"}
            className="text-gray-900 no-underline hover:text-orange-400"
          >
            <Image
              className="max-w-full"
              src={"/images/logo/logo.png"}
              alt="Ortiz Nosiglia Logo"
              width={60}
              height={60}
            />
          </Link>
        </div>
        <Flex
          padding="1.5rem"
          bg="transparent"
          gap={10}
          display={{ base: isMenuOpen ? "flex" : "none", md: "flex" }}
          direction={{ base: "column", md: "row" }}
          align={{ base: "center", md: "stretch" }}
        >
          <NavBarLink linkName="Inicio" linkUrl="/" />
          <NavBarLink linkName="Nuestro equipo" linkUrl={"/nuestro-equipo"} />
          <NavBarLink linkName="Reserva una cita" linkUrl={"/citas"} />
        </Flex>
        <div
          className={`mb-4 flex flex-col items-center gap-6 md:mb-0 md:flex-row md:gap-4 ${!isMenuOpen && "hidden"} md:flex`}
        >
          {session ? (
            <>
              {session.user.role !== rolesList.PACIENTE && (
                <li>
                  <Link
                    href={"/"}
                    className="rounded-xl  bg-orange-400 p-3 text-lg text-white no-underline transition-all  hover:text-orange-700 hover:drop-shadow-md "
                  >
                    Ingresar al dashboard
                  </Link>
                </li>
              )}
              <li>
                <UserDrawer session={session} />
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href={"/login"}
                  className="rounded-xl bg-orange-400 p-2 text-lg text-white no-underline transition-all duration-150  hover:text-orange-700 hover:drop-shadow-md"
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  href={"/crear-cuenta"}
                  className="rounded-xl border-2 border-orange-400 p-2 text-lg text-orange-400 no-underline transition-all hover:bg-orange-400 hover:text-white hover:drop-shadow-md"
                >
                  Crear Cuenta
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </nav>
  );
}
