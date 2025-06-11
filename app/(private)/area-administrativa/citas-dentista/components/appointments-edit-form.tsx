"use client";
import {
  Dialog,
  Button,
  CloseButton,
  Field,
  Flex,
  Input,
  Textarea,
  NativeSelect,
} from "@chakra-ui/react";
import { Appointment } from "@prisma/client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { edit } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";
import formatDateLocal from "../../../../../types/dateFormatter";
import {
  EditAppointmentSchema,
  TEditAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-calendar.schemas";
import { horariosDisponibles } from "../../citas/actions/operations";

export default function AppointmentsEditForm({
  props,
}: {
  props: {
    selectedAppointment: Appointment | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(EditAppointmentSchema),
    mode: "onChange",
    defaultValues: {
      ...props.selectedAppointment,
      programed_date_time: props.selectedAppointment
        ? formatDateLocal(props.selectedAppointment?.programed_date_time)
        : undefined,
      hora_cita: props.selectedAppointment
        ? props.selectedAppointment.programed_date_time
            .toISOString()
            .substring(11, 16)
        : undefined,
      note: props.selectedAppointment?.note ?? undefined,
      patient_instruction:
        props.selectedAppointment?.patient_instruction ?? undefined,
    },
  });
  const onSubmit = async (data: TEditAppointmentSchema) => {
    const res = await edit({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Cita editada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al editar la cita",
        type: "error",
      });
      reset();
    }
  };

  const fechaSeleccionada = watch("programed_date_time");
  const [horarios, sethorarios] = useState<string[]>([]);
  useEffect(() => {
    sethorarios([]);
    const cargarHorarios = async () => {
      if (fechaSeleccionada) {
        const res = await horariosDisponibles({
          date: new Date(fechaSeleccionada),
        });
        if (res.ok) {
          sethorarios(res.horarios);
        } else {
          sethorarios([]);
        }
      } else {
        sethorarios([]);
      }
    };
    cargarHorarios();
  }, [fechaSeleccionada]);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Edita la información del paciente</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Input type="hidden" {...register("id")} />
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
              type="date"
              variant="outline"
              {...register("programed_date_time")}
            />
            <Field.ErrorText>
              {errors.programed_date_time?.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root
            invalid={!!errors.hora_cita}
            px={4}
            w={{ base: "100%", md: "50%" }}
            required
          >
            <Field.Label>Hora de la cita</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona una hora"
                colorPalette={"orange"}
                value={watch("hora_cita") ?? ""}
                {...register("hora_cita", {
                  required: "Seleccione una hora para la cita",
                })}
              >
                {horarios.map((hora) => (
                  <option key={hora} value={hora}>
                    {hora}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.hora_cita?.message}
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
            w={{ base: "100%", md: "50%" }}
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
