"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Flex,
  Button,
  CloseButton,
  Input,
  Field,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { toaster } from "../../../../../components/ui/toaster";
import {
  CreateTreatmentSchema,
  TCreateTreatmentSchema,
} from "../../../../../lib/zod/z-treatment-schemas";
import { create } from "../actions/operations";

export default function TreatmentTypeCreateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreateTreatmentSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TCreateTreatmentSchema) => {
    const res = await create({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Tratamiento creado con éxito",
        type: "success",
      });
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al crear el tratamiento",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Crear un tipo de tratamiento</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
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
          Crear
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
