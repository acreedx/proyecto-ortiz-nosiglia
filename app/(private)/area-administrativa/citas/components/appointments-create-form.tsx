"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Flex,
  Button,
  CloseButton,
  Field,
  Input,
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { toaster } from "../../../../../components/ui/toaster";
import {
  CreateAppointmentSchema,
  TCreateAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import { create } from "../actions/operations";
import { User } from "@prisma/client";

export default function AppointmentsCreateForm({
  props,
}: {
  props: {
    doctores: User[];
    pacientes: User[];
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreateAppointmentSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TCreateAppointmentSchema) => {
    const res = await create({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Cita creada con éxito",
        type: "success",
      });
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al crear la cita",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Dialog.Header>
        <Dialog.Title>Crea una cita</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          {/* Fecha programada */}
          <Field.Root
            invalid={!!errors.programed_date_time}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha programada</Field.Label>
            <Input
              colorPalette="orange"
              type="datetime-local"
              variant="outline"
              {...register("programed_date_time")}
            />
            <Field.ErrorText>
              {errors.programed_date_time?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Especialidad */}
          <Field.Root
            invalid={!!errors.specialty}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Especialidad</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. Odontología"
              variant="outline"
              {...register("specialty")}
            />
            <Field.ErrorText>{errors.specialty?.message}</Field.ErrorText>
          </Field.Root>

          {/* Motivo */}
          <Field.Root
            invalid={!!errors.reason}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Motivo</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Ej. Dolor de muela"
              variant="outline"
              {...register("reason")}
            />
            <Field.ErrorText>{errors.reason?.message}</Field.ErrorText>
          </Field.Root>

          {/* Nota (opcional) */}
          <Field.Root
            invalid={!!errors.note}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Nota</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Nota adicional"
              variant="outline"
              {...register("note")}
            />
            <Field.ErrorText>{errors.note?.message}</Field.ErrorText>
          </Field.Root>

          {/* Instrucciones al paciente (opcional) */}
          <Field.Root
            invalid={!!errors.patient_instruction}
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Instrucciones al paciente</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Ej. Llegar 10 minutos antes"
              variant="outline"
              {...register("patient_instruction")}
            />
            <Field.ErrorText>
              {errors.patient_instruction?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
        {/* ID del paciente */}

        <Field.Root
          invalid={!!errors.patient_id}
          px={4}
          w={{ base: "100%", md: "100%" }}
          required
        >
          <Field.Label>Pacientes</Field.Label>
          <NativeSelect.Root size={"md"}>
            <NativeSelect.Field
              placeholder="Selecciona algún paciente registrado"
              colorPalette={"orange"}
              {...register("patient_id", {
                required: "Escoja un paciente registrado",
              })}
            >
              {props.pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>
                  {paciente.first_name} {paciente.last_name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText className="text-sm">
            {errors.patient_id?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root
          invalid={!!errors.doctor_id}
          px={4}
          pt={4}
          w={{ base: "100%", md: "100%" }}
          required
        >
          <Field.Label>Doctor</Field.Label>
          <NativeSelect.Root size={"md"}>
            <NativeSelect.Field
              placeholder="Selecciona algún doctor registrado"
              colorPalette={"orange"}
              {...register("doctor_id", {
                required: "Escoja un doctor registrado",
              })}
            >
              {props.doctores.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.first_name} {doctor.last_name}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          <Field.ErrorText className="text-sm">
            {errors.doctor_id?.message}
          </Field.ErrorText>
        </Field.Root>
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
