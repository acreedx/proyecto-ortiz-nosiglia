"use client";
import { Dialog, Button, Portal } from "@chakra-ui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";

export default function CreateLargeDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root unmountOnExit={false} size={"lg"} scrollBehavior={"inside"}>
      <Dialog.Trigger asChild>
        <Button variant="outline" size="sm">
          <LuPlus color="orange" /> Crear
        </Button>
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content
            colorPalette={"orange"}
            maxH={"90vh"}
            overflowY={"scroll"}
          >
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
}
