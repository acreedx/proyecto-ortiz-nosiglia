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
          {/* Fecha de programación */}
          <Field.Root
            invalid={!!errors.scheduled_on}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha de programación</Field.Label>
            <Input
              colorPalette="orange"
              type="datetime-local"
              variant="outline"
              {...register("scheduled_on")}
            />
            <Field.ErrorText>{errors.scheduled_on?.message}</Field.ErrorText>
          </Field.Root>

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
            <Input
              colorPalette="orange"
              type="text"
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
            <Input
              colorPalette="orange"
              type="text"
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
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Instrucciones al paciente</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. Llegar 10 minutos antes"
              variant="outline"
              {...register("patient_instruction")}
            />
            <Field.ErrorText>
              {errors.patient_instruction?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Fecha de cancelación (opcional) */}
          <Field.Root
            invalid={!!errors.cancellation_date}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha de cancelación</Field.Label>
            <Input
              colorPalette="orange"
              type="datetime-local"
              variant="outline"
              {...register("cancellation_date")}
            />
            <Field.ErrorText>
              {errors.cancellation_date?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* Motivo de cancelación (opcional) */}
          <Field.Root
            invalid={!!errors.cancellation_reason}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Motivo de cancelación</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. Emergencia personal"
              variant="outline"
              {...register("cancellation_reason")}
            />
            <Field.ErrorText>
              {errors.cancellation_reason?.message}
            </Field.ErrorText>
          </Field.Root>

          {/* ¿Cancelado? */}
          <Field.Root
            invalid={!!errors.is_cancelled}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>¿Está cancelada?</Field.Label>
            <select
              {...register("is_cancelled")}
              className="chakra-input css-1c6xhv5"
              style={{ padding: "0.5rem", borderRadius: "6px" }}
            >
              <option value="">Selecciona</option>
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
            <Field.ErrorText>{errors.is_cancelled?.message}</Field.ErrorText>
          </Field.Root>

          {/* ID del paciente */}
          <Field.Root
            invalid={!!errors.patient_id}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>ID del paciente</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              placeholder="ID del paciente"
              variant="outline"
              {...register("patient_id", { valueAsNumber: true })}
            />
            <Field.ErrorText>{errors.patient_id?.message}</Field.ErrorText>
          </Field.Root>

          <Field.Root
            invalid={!!errors.doctor_id}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Doctor</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona algún doctor registrado"
                colorPalette={"orange"}
                {...register("doctor_id")}
              >
                {props.doctores.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.first_name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.doctor_id?.message}
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
