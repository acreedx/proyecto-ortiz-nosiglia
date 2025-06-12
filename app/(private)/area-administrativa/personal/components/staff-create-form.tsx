"use client";
import { useForm } from "react-hook-form";
import { Dialog, Flex, Button, CloseButton } from "@chakra-ui/react";
import React from "react";

export default function StaffCreateForm() {
  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    mode: "onChange",
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onSubmit = async (data: any) => {
    //request
    //const res = await createOrganization({ data: data });
    //if (res.ok) {
    //  toaster.create({
    //    description: "Personal creado con éxito",
    //    type: "success",
    //  });
    //  reset();
    //}
    //if (!res.ok) {
    //  toaster.create({
    //    description: "Error al crear el personal",
    //    type: "error",
    //  });
    //}
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Crea una organización</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full"></Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Crear
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
