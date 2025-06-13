"use client";
import {
  Dialog,
  Flex,
  Field,
  Button,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  CreateQualificationSchema,
  TCreateQualificationSchema,
} from "../../../../../lib/zod/z-qualification-schemas";
import { createQualification } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";

export default function QualificationsCreateForm({
  doctor_id,
}: {
  doctor_id: number;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreateQualificationSchema),
    mode: "onChange",
    defaultValues: {
      doctor_id: doctor_id,
    },
  });
  const onSubmit = async (data: TCreateQualificationSchema) => {
    const res = await createQualification({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Título creado con éxito",
        type: "success",
      });
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al crear el título",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Agregar título al denstista</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full" flexDirection={"row"}>
          <Field.Root
            invalid={!!errors.type}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Tipo</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el tipo del título"
              {...register("type", {
                required: "El tipo es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.type?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.name}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Nombre del título</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el nombre del título"
              {...register("name", {
                required: "El nombre es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.institution}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Institución</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el nombre de la institución"
              {...register("institution", {
                required: "La institución es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.institution?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.country}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>País</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el nombre del país"
              {...register("country", {
                required: "El país requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.country?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.obtainment_date}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Fecha de obtención</Field.Label>
            <Input
              colorPalette="orange"
              type="date"
              variant="outline"
              placeholder="Selecciona la fecha de obtención"
              {...register("obtainment_date", {
                required: "La fecha de obtención es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.obtainment_date?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Añadir
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
