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
import { zodResolver } from "@hookform/resolvers/zod";
import { Appointment } from "@prisma/client";
import React from "react";
import { useForm } from "react-hook-form";
import { toaster } from "../../../../../components/ui/toaster";
import {
  CancelAppointmentSchema,
  TCancelAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import { cancelAppointment } from "../actions/operations";

export default function AppointmentsCancelForm({
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
    resolver: zodResolver(CancelAppointmentSchema),
    mode: "onChange",
    defaultValues: {
      id: props.selectedAppointment?.id,
    },
  });
  const onSubmit = async (data: TCancelAppointmentSchema) => {
    const res = await cancelAppointment({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Cita cancelada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al cancelar la cita",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Ingresa el motivo de cancelación de la cita</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.cancellation_reason}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Motivo de cancelación</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              {...register("cancellation_reason", {
                required: "Ingresa el motivo de la cancelación",
              })}
            />
            <Field.ErrorText>
              {errors.cancellation_reason?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Aceptar
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
