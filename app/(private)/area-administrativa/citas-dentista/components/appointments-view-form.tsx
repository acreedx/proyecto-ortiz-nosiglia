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
import { EditAppointmentSchema } from "../../../../../lib/zod/z-appointment-schemas";
import { useForm } from "react-hook-form";
import { formatDateTimeLocal } from "../../../../../types/dateFormatter";

export default function AppointmentsViewForm({
  props,
}: {
  props: {
    selectedAppointment: Appointment | undefined;
  };
}) {
  const { register } = useForm({
    resolver: zodResolver(EditAppointmentSchema),
    mode: "onChange",
    disabled: true,
    defaultValues: {
      ...props.selectedAppointment,
      programed_date_time: props.selectedAppointment
        ? formatDateTimeLocal(props.selectedAppointment?.programed_date_time)
        : undefined,
      note: props.selectedAppointment?.note ?? undefined,
      patient_instruction:
        props.selectedAppointment?.patient_instruction ?? undefined,
    },
  });
  return (
    <div>
      <Dialog.Header>
        <Dialog.Title>Ver la información de la cita</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Field.Root required px={4} w={{ base: "100%", md: "50%" }}>
            <Field.Label>Fecha programada</Field.Label>
            <Input
              colorPalette="orange"
              type="datetime-local"
              variant="outline"
              {...register("programed_date_time")}
            />
          </Field.Root>
          <Field.Root required px={4} w={{ base: "100%", md: "50%" }}>
            <Field.Label>Especialidad</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              placeholder="Ej. Odontología"
              variant="outline"
              {...register("specialty")}
            />
          </Field.Root>

          {/* Motivo */}
          <Field.Root required px={4} w={{ base: "100%", md: "50%" }}>
            <Field.Label>Motivo</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Ej. Dolor de muela"
              variant="outline"
              {...register("reason")}
            />
          </Field.Root>

          {/* Nota (opcional) */}
          <Field.Root px={4} w={{ base: "100%", md: "50%" }}>
            <Field.Label>Nota</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Nota adicional"
              variant="outline"
              {...register("note")}
            />
          </Field.Root>
          <Field.Root px={4} w={{ base: "100%", md: "50%" }}>
            <Field.Label>Instrucciones al paciente</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              placeholder="Ej. Llegar 10 minutos antes"
              variant="outline"
              {...register("note")}
            />
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </div>
  );
}
