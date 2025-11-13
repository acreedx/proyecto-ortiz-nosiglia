"use client";

import { Dialog, Portal, createOverlay } from "@chakra-ui/react";

interface DialogProps {
  content?: React.ReactNode;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "cover" | "full";
  unmountOnExit?: true | false;
}

export const dialog = createOverlay<DialogProps>((props) => {
  const { content, size = "sm", unmountOnExit = false, ...rest } = props;
  return (
    <Dialog.Root
      {...rest}
      unmountOnExit={unmountOnExit}
      size={size}
      scrollBehavior={"inside"}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content colorPalette={"orange"} zIndex={-1}>
            {content}
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

export function DialogProvider() {
  return <dialog.Viewport />;
}
