"use client";
import {
  Dialog,
  Flex,
  Field,
  Button,
  CloseButton,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Treatment } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { toaster } from "../../../../../components/ui/toaster";
import { edit } from "../actions/operations";
import {
  EditTreatmentSchema,
  TEditTreatmentSchema,
} from "../../../../../lib/zod/z-treatment-schemas";

export default function TreatmentTypeEditForm({
  props,
}: {
  props: {
    treatment: Treatment | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEditTreatmentSchema>({
    resolver: zodResolver(EditTreatmentSchema),
    mode: "onChange",
    defaultValues: props.treatment,
  });
  const onSubmit = async (data: TEditTreatmentSchema) => {
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
          <Field.Root
            invalid={!!errors.treatment_type}
            required
            px={4}
            w="full"
          >
            <Field.Label>Tipo de tratamiento</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el tipo de tratamiento"
              {...register("treatment_type", {
                required: "El tipo de tratamiento es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.treatment_type?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.title} required px={4} w="full">
            <Field.Label>Título</Field.Label>
            <Input
              type="text"
              colorPalette="orange"
              variant="outline"
              placeholder="Ingresa el título del tratamiento"
              {...register("title", {
                required: "El título es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.title?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.description} required px={4} w="full">
            <Field.Label>Descripción</Field.Label>
            <Textarea
              resize={"none"}
              colorPalette="orange"
              variant="outline"
              placeholder="Ingresa la descripción del tratamiento"
              {...register("description", {
                required: "La descripción es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.description?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.estimated_appointments}
            required
            px={4}
            w="full"
          >
            <Field.Label>Citas estimadas</Field.Label>
            <Input
              type="number"
              colorPalette="orange"
              variant="outline"
              placeholder="Ingresa las citas estimadas del tratamiento"
              {...register("estimated_appointments", {
                required: "Las citas estimadas son requeridas",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.estimated_appointments?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.days_between_appointments}
            required
            px={4}
            w="full"
          >
            <Field.Label>Días entre citas</Field.Label>
            <Input
              type="number"
              colorPalette="orange"
              variant="outline"
              placeholder="Ingresa los días entre citas"
              {...register("days_between_appointments", {
                required: "Los días entre citas son requeridos",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.days_between_appointments?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.cost_estimation}
            required
            px={4}
            w="full"
          >
            <Field.Label>Costo estimado</Field.Label>
            <Input
              type="number"
              colorPalette="orange"
              variant="outline"
              placeholder="Ingresa el costo estimado del tratamiento"
              {...register("cost_estimation", {
                required: "El costo estimado es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.cost_estimation?.message}
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
