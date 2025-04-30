"use client";
import {
  Avatar,
  Button,
  CloseButton,
  Drawer,
  HStack,
  Link,
  Portal,
  Text,
} from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";

export default function UserDrawer({ session }: { session: Session }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const onMenuOpen = () => setIsMenuOpen(true);
  return (
    <Drawer.Root open={isMenuOpen} onOpenChange={(e) => setIsMenuOpen(e.open)}>
      <Drawer.Trigger asChild>
        <Button
          onClick={onMenuOpen}
          className="rounded-xl border-2 bg-white border-orange-400 py-8 text-lg text-orange-400 no-underline transition-all duration-300 hover:bg-orange-400 hover:text-white hover:drop-shadow-md focus:no-underline focus:shadow-none focus:outline-none"
        >
          <HStack>
            <Avatar.Root size={"md"}>
              <Avatar.Fallback
                name={`${session.user.first_name}-${session.user.last_name}`}
              />
              <Avatar.Image src={session.user.photo_url} />
            </Avatar.Root>
            <div className="flex flex-col">
              <Text fontWeight="bold">
                {session.user.first_name + " " + session.user.last_name}
              </Text>
              <Text fontSize="sm" color="black">
                Ver perfil
              </Text>
            </div>
          </HStack>
        </Button>
      </Drawer.Trigger>
      <Portal>
        <Drawer.Backdrop colorPalette={"orange"} />
        <Drawer.Positioner>
          <Drawer.Content className="bg-white">
            <Drawer.Header
              className="text-xl font-bold"
              justifyContent={"center"}
            >
              Perfil del Usuario
            </Drawer.Header>
            <Drawer.Body>
              <div className="mb-4 flex flex-col items-center">
                <Avatar.Root size={"2xl"}>
                  <Avatar.Fallback
                    name={`${session.user.first_name}-${session.user.last_name}`}
                  />
                  <Avatar.Image src={session.user.photo_url} />
                </Avatar.Root>
                <h2 className="mt-2 text-xl font-bold">
                  {session.user.first_name} {session.user.last_name}
                </h2>
                <p className="text-gray-600">{session.user.email}</p>
                <p className="text-gray-600">{session.user.role}</p>
              </div>
              <div className="flex flex-col items-center justify-center gap-4">
                <Link
                  href={"/editar-perfil"}
                  className="rounded-xl bg-orange-400 p-1 text-base text-white no-underline transition-all duration-300  hover:text-orange-700 hover:drop-shadow-md "
                >
                  Editar perfil
                </Link>
                <Link
                  href={"/cambio-de-password"}
                  className="rounded-xl bg-orange-400 p-1 text-base text-white no-underline transition-all duration-300  hover:text-orange-700 hover:drop-shadow-md "
                >
                  Cambiar contraseña
                </Link>
                <a
                  href="/logout"
                  className="rounded-xl border-2 border-orange-400 p-1 text-base text-orange-400 no-underline transition-all duration-300 hover:bg-orange-400 hover:text-white hover:drop-shadow-md focus:no-underline focus:shadow-none focus:outline-none"
                >
                  Cerrar sesión
                </a>
              </div>
            </Drawer.Body>
            <Drawer.CloseTrigger asChild>
              <CloseButton
                size={"sm"}
                colorPalette={"orange"}
                color={"orange.400"}
                _hover={{
                  backgroundColor: "orange.400",
                  color: "white",
                }}
              />
            </Drawer.CloseTrigger>
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    </Drawer.Root>
  );
}
