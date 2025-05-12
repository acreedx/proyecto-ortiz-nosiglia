"use client";
import { Dialog, Portal, UseDialogReturn } from "@chakra-ui/react";
import React from "react";

export default function EditDialog({
  children,
  dialog,
}: {
  children: React.ReactNode;
  dialog: UseDialogReturn;
}) {
  return (
    <Dialog.RootProvider value={dialog}>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content colorPalette={"orange"} zIndex={-1}>
            {children}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.RootProvider>
  );
}
