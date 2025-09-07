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
  Text,
  Avatar,
  Box,
  Heading,
  Stack,
  UseDialogReturn,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toaster } from "../../../../../components/ui/toaster";
import {
  CreateAppointmentSchema,
  TCreateAppointmentSchema,
} from "../../../../../lib/zod/z-appointment-schemas";
import { create, horariosDisponibles } from "../actions/operations";
import { User } from "@prisma/client";
import { GridApi, IDatasource } from "ag-grid-community";

export default function AppointmentsCreateForm({
  props,
}: {
  props: {
    doctores: User[];
    pacientes: User[];
    dialog: UseDialogReturn;
    gridApiRef: React.RefObject<GridApi | null>;
    datasourceRef: React.RefObject<IDatasource | null>;
  };
}) {
  const [horarios, sethorarios] = useState<string[]>([]);
  const {
    register,
    handleSubmit,
    watch,
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
      if (props.gridApiRef.current && props.datasourceRef.current) {
        props.gridApiRef.current.setGridOption(
          "datasource",
          props.datasourceRef.current
        );
      }
      reset();
      props.dialog.setOpen(false);
    }
    if (!res.ok) {
      toaster.create({
        description: res.mensaje ? res.mensaje : "Error al crear la cita",
        type: "error",
      });
    }
  };
  const [pacienteSeleccionado, setpacienteSeleccionado] = useState<
    User | undefined
  >();
  const idPacienteSeleccionado = watch("patient_id");
  useEffect(() => {
    if (idPacienteSeleccionado) {
      const pacienteFiltrado = props.pacientes.find(
        (e) => e.id === Number(idPacienteSeleccionado)
      );
      if (pacienteFiltrado) {
        setpacienteSeleccionado(pacienteFiltrado);
      } else {
        setpacienteSeleccionado(undefined);
      }
    } else {
      setpacienteSeleccionado(undefined);
    }
  }, [idPacienteSeleccionado, props.pacientes]);
  const fechaSeleccionada = watch("programed_date_time");
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
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Dialog.Header>
        <Dialog.Title>Crea una cita</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            {/* ID del paciente */}
            <Field.Root
              invalid={!!errors.patient_id}
              px={4}
              w={{ base: "100%", md: "100%" }}
              required
              mb={4}
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
                      {paciente.last_name} {paciente.first_name}
                    </option>
                  ))}
                </NativeSelect.Field>
                <NativeSelect.Indicator />
              </NativeSelect.Root>
              <Field.ErrorText className="text-sm">
                {errors.patient_id?.message}
              </Field.ErrorText>
            </Field.Root>
            {pacienteSeleccionado ? (
              <div className="px-4 flex flex-col items-center">
                <Box
                  px={6}
                  py={4}
                  borderWidth="1px"
                  borderRadius="lg"
                  boxShadow="md"
                  maxW="md"
                  w="full"
                  mx="auto"
                  bg="white"
                >
                  <Stack gap={4} align="center">
                    <Heading size="md" textAlign="center">
                      Información del paciente
                    </Heading>
                    <Avatar.Root size="xl">
                      <Avatar.Image
                        src={pacienteSeleccionado.photo_url}
                        alt={`Foto de ${pacienteSeleccionado.first_name} ${pacienteSeleccionado.last_name}`}
                      />
                      <Avatar.Fallback>
                        {pacienteSeleccionado.first_name.charAt(0)}
                        {pacienteSeleccionado.last_name.charAt(0)}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <Text fontWeight="bold" fontSize="lg">
                      {pacienteSeleccionado.first_name}{" "}
                      {pacienteSeleccionado.last_name}
                    </Text>

                    <Box w="full">
                      <Text>
                        <strong>C.I.:</strong>{" "}
                        {pacienteSeleccionado.identification}
                      </Text>
                      <Text>
                        <strong>Dirección:</strong>{" "}
                        {pacienteSeleccionado.address_line},{" "}
                        {pacienteSeleccionado.address_city}
                      </Text>
                      <Text>
                        <strong>Correo:</strong> {pacienteSeleccionado.email}
                      </Text>
                      <Text>
                        <strong>Teléfono:</strong> {pacienteSeleccionado.phone}
                      </Text>
                      <Text>
                        <strong>Celular:</strong> {pacienteSeleccionado.mobile}
                      </Text>
                      <Text>
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {new Date(
                          pacienteSeleccionado.birth_date
                        ).toLocaleDateString()}
                      </Text>
                    </Box>
                  </Stack>
                </Box>
              </div>
            ) : (
              <Heading px={4} size={"md"}>
                Seleccione un paciente para ver su información
              </Heading>
            )}
          </div>
          <div className="w-full md:w-1/2">
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
              <Field.Root
                invalid={!!errors.doctor_id}
                px={4}
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
                        {doctor.last_name} {doctor.first_name}
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
          </div>
        </div>
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
