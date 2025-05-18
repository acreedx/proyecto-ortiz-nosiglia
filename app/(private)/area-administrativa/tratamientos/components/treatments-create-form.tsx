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
  NativeSelect,
} from "@chakra-ui/react";
import React from "react";
import { toaster } from "../../../../../components/ui/toaster";
import { create } from "../actions/operations";
import {
  CreateCarePlanSchema,
  TCreateCarePlanSchema,
} from "../../../../../lib/zod/z-care-plan-schemas";
import { User } from "@prisma/client";

export default function TreatmentsCreateForm({
  props,
}: {
  props: {
    pacientes: User[];
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreateCarePlanSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TCreateCarePlanSchema) => {
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
        <Dialog.Title>Crear un tratamiento</Dialog.Title>
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
            <Field.Label>Título</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Título del plan"
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
              placeholder="Descripción del plan de cuidado"
              variant="outline"
              {...register("description")}
            />
            <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
          </Field.Root>

          {/* Fecha de inicio */}
          <Field.Root
            invalid={!!errors.start_date}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha de inicio</Field.Label>
            <Input
              colorPalette="orange"
              type="date"
              variant="outline"
              {...register("start_date")}
            />
            <Field.ErrorText>{errors.start_date?.message}</Field.ErrorText>
          </Field.Root>

          {/* Fecha de finalización */}
          <Field.Root
            invalid={!!errors.end_date}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha de finalización</Field.Label>
            <Input
              colorPalette="orange"
              type="date"
              variant="outline"
              {...register("end_date")}
            />
            <Field.ErrorText>{errors.end_date?.message}</Field.ErrorText>
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
              placeholder="Ej. 6"
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

          {/* Total de citas (opcional) */}
          <Field.Root
            invalid={!!errors.total_appointments}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Total de citas</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              placeholder="Ej. 12"
              variant="outline"
              {...register("total_appointments", { valueAsNumber: true })}
            />
            <Field.ErrorText>
              {errors.total_appointments?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Costo */}
          <Field.Root
            invalid={!!errors.cost}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Costo estimado</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. 250.00"
              variant="outline"
              {...register("cost")}
            />
            <Field.ErrorText>{errors.cost?.message}</Field.ErrorText>
          </Field.Root>

          {/* ID del paciente */}

          <Field.Root
            invalid={!!errors.patient_id}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Pacientes</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona algún paciente registrado"
                colorPalette={"orange"}
                {...register("patient_id")}
              >
                {props.pacientes.map((paciente) => (
                  <option key={paciente.id} value={paciente.id}>
                    {paciente.first_name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.patient_id?.message}
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
