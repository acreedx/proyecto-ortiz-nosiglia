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
import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import {
  CreateAppointmentCalendarSchema,
  TCreateAppointmentCalendarSchema,
} from "../../../../lib/zod/z-appointment-calendar-patient.schemas";
import formatDateLocal from "../../../../types/dateFormatter";
import {
  createDentistAppointment,
  horariosDisponibles,
} from "../actions/operations";
import { toaster } from "../../../../components/ui/toaster";

export default function AppointmentsCreateCalendarForm({
  props,
}: {
  props: {
    doctores: User[];
    selectedDate: Date | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TCreateAppointmentCalendarSchema>({
    resolver: zodResolver(CreateAppointmentCalendarSchema),
    mode: "onChange",
    defaultValues: {
      programed_date_time: props.selectedDate
        ? formatDateLocal(props.selectedDate)
        : undefined,
    },
  });
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
  const onSubmit = async (data: TCreateAppointmentCalendarSchema) => {
    const res = await createDentistAppointment({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Cita creada con éxito",
        type: "success",
      });
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: res.mensaje ? res.mensaje : "Error al crear la cita",
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
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Fecha programada</Field.Label>
            <Input
              colorPalette="orange"
              type="date"
              readOnly
              variant="outline"
              {...register("programed_date_time")}
            />
            <Field.ErrorText>
              {errors.programed_date_time?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.doctor_id}
            px={4}
            w={{ base: "100%", md: "100%" }}
            required
          >
            <Field.Label>Dentistas</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona algún dentista registrado"
                colorPalette={"orange"}
                {...register("doctor_id", {
                  required: "Escoja un dentista registrado",
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
          <Field.Root
            invalid={!!errors.hora_cita}
            px={4}
            w={{ base: "100%", md: "100%" }}
            required
          >
            <Field.Label>Hora de la cita</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona una hora"
                colorPalette={"orange"}
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
