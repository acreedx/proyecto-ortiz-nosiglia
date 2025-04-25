"use client";
import Image from "next/image";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Flex, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import NavBarLink from "./nav-bar-link";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  //const router = useRouter();
  //const [isOpen, setIsOpen] = useState(false);
  //const { data: session, status } = useSession();
  //const LogOut = async () => {
  //  await signOut({
  //    redirect: false,
  //  }).then(() => {
  //    onClose();
  //    router.push(routes.login);
  //  });
  //};
  //const onOpen = () => setIsOpen(true);
  //const onClose = () => setIsOpen(false);

  return (
    <nav className="border-b-1 sticky flex w-full flex-col justify-center md:flex-row">
      <button
        className="absolute right-4 top-4 z-10 md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? (
          <FaTimes size={24} color="orange" />
        ) : (
          <FaBars size={24} color="orange" />
        )}
      </button>
      <ul className="m-0 mb-0 flex w-full list-none flex-col items-center p-0 py-2 align-middle md:flex-row  md:items-stretch md:justify-around">
        <div className="flex flex-col items-center md:flex-row ">
          <Link
            as={NextLink}
            href={"TODO"}
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
          <NavBarLink linkName="Nuestro equipo" linkUrl={"TODO"} />
          <NavBarLink linkName="Reserva una cita" linkUrl={"TODO"} />
          {/*
          <NavBarLinkDropDownChakra
            linkName="Nuestro equipo"
            linkUrl="/equipo"
            subLinks={[
              { name: "Equipo Médico", url: "/equipo/medico" },
              { name: "Equipo Administrativo", url: "/equipo/administrativo" },
            ]}
          />
          */}
        </Flex>
        {/*
        <div
          className={`mb-4 flex flex-col items-center gap-6 md:mb-0 md:flex-row md:gap-4 ${!isMenuOpen && "hidden"} md:flex`}
        >
          {status === "loading" ? (
            <Spinner />
          ) : session?.user ? (
            <>
              {session.user.resourceType === "Person" && (
                <li>
                  <Link
                    href={routes.dashboard}
                    className="rounded-xl  bg-orange-400 p-3 text-lg text-white no-underline transition-all  hover:text-orange-700 hover:drop-shadow-md "
                  >
                    Ingresar al dashboard
                  </Link>
                </li>
              )}
              <li>
                <button
                  onClick={onOpen}
                  className="rounded-xl border-2 border-orange-400 p-2 text-lg text-orange-400 no-underline transition-all duration-300 hover:bg-orange-400 hover:text-white hover:drop-shadow-md focus:no-underline focus:shadow-none focus:outline-none"
                >
                  <HStack>
                    <Avatar
                      size="md"
                      name={
                        session.user.firstName + " " + session.user.familyName
                      }
                      src={session.user.photoUrl}
                    />
                    <div className="flex flex-col">
                      <Text fontWeight="bold">
                        {session.user.firstName + " " + session.user.familyName}
                      </Text>
                      <Text fontSize="sm" color="black">
                        Ver perfil
                      </Text>
                    </div>
                  </HStack>
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  href={routes.login}
                  className="rounded-xl bg-orange-400 p-2 text-lg text-white no-underline transition-all duration-300  hover:text-orange-700 hover:drop-shadow-md "
                >
                  Iniciar Sesión
                </Link>
              </li>
              <li>
                <Link
                  href={routes.registro}
                  className="rounded-xl border-2 border-orange-400 p-2 text-lg text-orange-400 no-underline transition-all hover:bg-orange-400 hover:text-white hover:drop-shadow-md"
                >
                  Crear Cuenta
                </Link>
              </li>
            </>
          )}
        </div>*/}
      </ul>
      {/* 
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        {status === "loading" ? (
          <Spinner />
        ) : session?.user ? (
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Perfil del Usuario</DrawerHeader>
            <DrawerBody>
              <div className="mb-4 flex flex-col items-center">
                <Avatar
                  size="2xl"
                  name={session.user.firstName}
                  src={session.user.photoUrl}
                />
                <h2 className="mt-2 text-xl font-bold">
                  {personFullNameFormater(session.user)}
                </h2>
                <p className="text-gray-600">{session.user.email}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  href={routes.editarperfil}
                  className="rounded-xl bg-orange-400 p-2 text-lg text-white no-underline transition-all duration-300  hover:text-orange-700 hover:drop-shadow-md "
                >
                  Ver Perfil
                </Link>
                <Link
                  href={routes.cambiopassword}
                  className="rounded-xl bg-orange-400 p-2 text-lg text-white no-underline transition-all duration-300  hover:text-orange-700 hover:drop-shadow-md "
                >
                  Cambiar contraseña
                </Link>
                <button
                  onClick={LogOut}
                  className="rounded-xl border-2 border-orange-400 p-2 text-lg text-orange-400 no-underline transition-all duration-300 hover:bg-orange-400 hover:text-white hover:drop-shadow-md focus:no-underline focus:shadow-none focus:outline-none"
                >
                  Cerrar Sesión
                </button>
              </div>
            </DrawerBody>
          </DrawerContent>
        ) : (
          <>Usuario no encontrado</>
        )}
      </Drawer>*/}
    </nav>
  );
}
