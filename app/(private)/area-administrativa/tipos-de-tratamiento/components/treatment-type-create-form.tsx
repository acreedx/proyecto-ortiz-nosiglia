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
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Tipo de tratamiento</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. Ortodoncia"
              variant="outline"
              {...register("treatment_type")}
            />
            <Field.ErrorText>{errors.treatment_type?.message}</Field.ErrorText>
          </Field.Root>

          {/* Título */}
          <Field.Root
            invalid={!!errors.title}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Título del tratamiento</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Título descriptivo"
              variant="outline"
              {...register("title")}
            />
            <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
          </Field.Root>

          {/* Descripción */}
          <Field.Root invalid={!!errors.description} required px={4} w="full">
            <Field.Label>Descripción</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Detalles del tratamiento"
              variant="outline"
              {...register("description")}
            />
            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
          </Field.Root>

          {/* Citas estimadas */}
          <Field.Root
            invalid={!!errors.estimated_appointments}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Citas estimadas</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              placeholder="Ej. 4"
              variant="outline"
              {...register("estimated_appointments", { valueAsNumber: true })}
            />
            <Field.ErrorText>
              {errors.estimated_appointments?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Días entre citas */}
          <Field.Root
            invalid={!!errors.days_between_appointments}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Días entre citas</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              placeholder="Ej. 7"
              variant="outline"
              {...register("days_between_appointments", {
                valueAsNumber: true,
              })}
            />
            <Field.ErrorText>
              {errors.days_between_appointments?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Estimación de costos */}
          <Field.Root
            invalid={!!errors.cost_estimation}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Costo estimado del tratamiento</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              step="0.01"
              placeholder="Ej. 150.00"
              variant="outline"
              {...register("cost_estimation", { valueAsNumber: true })}
            />
            <Field.ErrorText>{errors.cost_estimation?.message}</Field.ErrorText>
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
