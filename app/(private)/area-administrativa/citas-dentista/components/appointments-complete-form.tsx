"use client";
import {
  Dialog,
  Flex,
  Field,
  Textarea,
  Button,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import { Appointment } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeAppointment } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import {
  CompleteAppointmentSchema,
  TCompleteAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-calendar.schemas";

export default function AppointmentsCompleteForm({
  props,
}: {
  props: {
    selectedAppointment: Appointment | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CompleteAppointmentSchema),
    mode: "onChange",
    defaultValues: {
      id: props.selectedAppointment?.id,
    },
  });
  const onSubmit = async (data: TCompleteAppointmentSchema) => {
    const res = await completeAppointment({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Cita completada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al completar la cita",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Ingresa el diagnóstico de la cita</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.diagnosis}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Diagnóstico</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              {...register("diagnosis", {
                required: "Ingresa un diagnóstico para la cita",
              })}
            />
            <Field.ErrorText>{errors.diagnosis?.message}</Field.ErrorText>
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Completar
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
