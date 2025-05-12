"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  EditOrganizationSchema,
  TEditOrganizationSchema,
} from "../../../../../lib/zod/z-organization-schemas";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
} from "@chakra-ui/react";
import { editOrganization } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import { Organization } from "@prisma/client";

export default function EditOrganizationsForm({
  organization,
}: {
  organization: Organization | undefined;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(EditOrganizationSchema),
    mode: "onChange",
    defaultValues: organization,
  });
  const onSubmit = async (data: TEditOrganizationSchema) => {
    const res = await editOrganization({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Organización creada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al crear la organización",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Crea una organización</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.name}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Nombre</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el nombre"
              {...register("name", {
                required: "El nombre es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.address}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Dirección</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa una dirección"
              {...register("address", {
                required: "La dirección es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.address?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Editar
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
