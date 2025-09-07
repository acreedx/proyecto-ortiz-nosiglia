"use client";
import { Button, Dialog, Portal, UseDialogReturn } from "@chakra-ui/react";
import React from "react";
import { LuPlus } from "react-icons/lu";

export default function EditXlDialogWithButton({
  children,
  dialog,
}: {
  children: React.ReactNode;
  dialog: UseDialogReturn;
}) {
  return (
    <Dialog.RootProvider
      value={dialog}
      unmountOnExit={false}
      size={"xl"}
      scrollBehavior={"inside"}
    >
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
    </Dialog.RootProvider>
  );
}
