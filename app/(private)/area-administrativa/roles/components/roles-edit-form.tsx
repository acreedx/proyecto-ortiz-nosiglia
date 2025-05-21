"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  Checkbox,
  CheckboxGroup,
  CloseButton,
  Dialog,
  Field,
  Fieldset,
  Flex,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { toaster } from "../../../../../components/ui/toaster";
import { Permission, Prisma } from "@prisma/client";
import {
  EditRoleSchema,
  TEditRoleSchema,
} from "../../../../../lib/zod/z-role-schemas";
import { edit } from "../actions/operations";

export default function RolesEditForm({
  props,
}: {
  props: {
    role:
      | Prisma.RoleGetPayload<{
          include: {
            role_permissions: {
              include: {
                permission: true;
              };
            };
          };
        }>
      | undefined;
    permissions: Permission[];
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEditRoleSchema>({
    resolver: zodResolver(EditRoleSchema),
    mode: "onChange",
    defaultValues: {
      ...props.role,
      permissions:
        props.role?.role_permissions.map(
          (permissions) => permissions.permission.id
        ) || [],
    },
  });
  const onSubmit = async (data: TEditRoleSchema) => {
    const res = await edit({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Rol editado con éxito",
        type: "success",
      });
    } else {
      toaster.create({
        description: "Error al editar el rol",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Editar un Rol</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Input type="hidden" {...register("id")} />
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
            <CheckboxGroup
              defaultValue={
                props.role?.role_permissions.map((permissions) =>
                  permissions.permission.id.toString()
                ) || []
              }
            >
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
                  <Checkbox.Label>{permission.permission_name}</Checkbox.Label>
                </Checkbox.Root>
              ))}
            </CheckboxGroup>
            <Fieldset.ErrorText className="text-sm">
              {errors.permissions?.message}
            </Fieldset.ErrorText>
          </Fieldset.Root>
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
