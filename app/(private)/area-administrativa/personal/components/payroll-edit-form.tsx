"use client";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import {
  EditPayrollSchema,
  TEditPayrollSchema,
} from "../../../../../lib/zod/z-payroll-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPayroll } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";

export default function EditPayrollForm({
  user,
}: {
  user:
    | Prisma.UserGetPayload<{
        include: {
          staff: {
            include: {
              payroll: true;
            };
          };
          role: true;
        };
      }>
    | undefined;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(EditPayrollSchema),
    mode: "onChange",
    defaultValues: {
      ...user?.staff?.payroll,
      user_id: user?.id.toString(),
    },
  });
  const onSubmit = async (data: TEditPayrollSchema) => {
    const res = await editPayroll({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Nómina creada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al actualizar la nómina",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Editar la información del personal</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full" flexDirection={"row"}>
          <Input type="hidden" {...register("user_id")} />
          <Field.Root
            invalid={!!errors.salary}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Salario en bs</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              variant="outline"
              placeholder="Ingresa el salario del personal"
              {...register("salary", {
                required: "El salario es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.salary?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.bonus}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Bonus en bs</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              variant="outline"
              placeholder="Ingresa la cantidad de bonus"
              {...register("bonus", {
                required: "El bonus es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.bonus?.message}
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
