"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Flex,
  Button,
  CloseButton,
  Checkbox,
  CheckboxGroup,
  Field,
  Fieldset,
  Input,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { toaster } from "../../../../../components/ui/toaster";
import { RoleSchema, TRoleSchema } from "../../../../../lib/zod/z-role-schemas";
import { Permission } from "@prisma/client";
import { create } from "../actions/operations";

export default function RolesCreateForm({
  props,
}: {
  props: {
    permissions: Permission[];
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(RoleSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TRoleSchema) => {
    const res = await create({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Rol creado con éxito",
        type: "success",
      });
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: res.message ? res.message : "Error al crear el rol",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Crea una organización</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Flex wrap="wrap" gapY={4} mb={4} w="full">
            <Field.Root invalid={!!errors.role_name} required px={4} w="full">
              <Field.Label>Nombre del rol</Field.Label>
              <Input
                colorPalette="orange"
                type="text"
                variant="outline"
                placeholder="Ingresa el nombre del rol"
                {...register("role_name", {
                  required: "El nomre de rol es requerido",
                })}
              />
              <Field.ErrorText className="text-sm">
                {errors.role_name?.message}
              </Field.ErrorText>
            </Field.Root>
            <Field.Root invalid={!!errors.description} required px={4} w="full">
              <Field.Label>Descripción</Field.Label>
              <Textarea
                colorPalette="orange"
                variant="outline"
                placeholder="Ingresa la descripción del rol"
                {...register("description", {
                  required: "La descripción es requerida",
                })}
                resize={"none"}
              />
              <Field.ErrorText className="text-sm">
                {errors.description?.message}
              </Field.ErrorText>
            </Field.Root>
            <Fieldset.Root
              className="flex flex-col w-full justify-center px-4 gap-2"
              invalid={!!errors.permissions}
            >
              <Fieldset.Legend className="text-base">Permisos</Fieldset.Legend>
              <CheckboxGroup defaultValue={[]}>
                {props.permissions.map((permission, index) => (
                  <Checkbox.Root
                    key={index}
                    variant={"outline"}
                    className="text-sm"
                    value={permission.id.toString()}
                    {...register(`permissions`)}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>
                      {permission.permission_name}
                    </Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </CheckboxGroup>
              <Fieldset.ErrorText className="text-sm">
                {errors.permissions?.message}
              </Fieldset.ErrorText>
            </Fieldset.Root>
          </Flex>
        </Flex>
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
