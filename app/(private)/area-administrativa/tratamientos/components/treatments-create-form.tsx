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
  Textarea,
  Heading,
  Avatar,
  Box,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { toaster } from "../../../../../components/ui/toaster";
import { create } from "../actions/operations";
import {
  CreateCarePlanSchema,
  TCreateCarePlanSchema,
} from "../../../../../lib/zod/z-care-plan-schemas";
import { Treatment, User } from "@prisma/client";
import { GridApi, IDatasource } from "ag-grid-community";

export default function TreatmentsCreateForm({
  props,
}: {
  props: {
    pacientes: User[];
    treatmentTypes: Treatment[];
    gridApiRef: React.RefObject<GridApi | null>;
    datasourceRef: React.RefObject<IDatasource | null>;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(CreateCarePlanSchema),
    mode: "onChange",
  });
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
  const treatmentTypeId = watch("treatment_type_id");
  useEffect(() => {
    if (treatmentTypeId) {
      const filteredTreatment = props.treatmentTypes.find(
        (treatment) => String(treatment.id) === String(treatmentTypeId)
      );
      if (filteredTreatment) {
        setValue("treatment_type", filteredTreatment.treatment_type);
        setValue("title", filteredTreatment.title);
        setValue("description", filteredTreatment.description);
        setValue(
          "estimated_appointments",
          filteredTreatment.estimated_appointments
        );
        setValue(
          "days_between_appointments",
          filteredTreatment.days_between_appointments
        );
        setValue("cost", filteredTreatment.cost_estimation);
      }
    }
  }, [treatmentTypeId]);
  const onSubmit = async (data: TCreateCarePlanSchema) => {
    const res = await create({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Tratamiento creado con éxito",
        type: "success",
      });
      if (props.gridApiRef.current && props.datasourceRef.current) {
        props.gridApiRef.current.setGridOption(
          "datasource",
          props.datasourceRef.current
        );
      }
      reset();
    } else {
      toaster.create({
        description: "Error al crear el tratamiento",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Dialog.Header>
        <Dialog.Title>Crear un tratamiento</Dialog.Title>
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
              <Field.Root
                invalid={!!errors.treatment_type_id}
                px={4}
                w={{ base: "100%", md: "50%" }}
              >
                <Field.Label>Tratamiento</Field.Label>
                <NativeSelect.Root size={"md"}>
                  <NativeSelect.Field
                    placeholder="Selecciona algún tratamiento registrado"
                    colorPalette={"orange"}
                    {...register("treatment_type_id")}
                  >
                    {props.treatmentTypes.map((treatment) => (
                      <option key={treatment.id} value={treatment.id}>
                        {treatment.title}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
                <Field.ErrorText className="text-sm">
                  {errors.treatment_type_id?.message}
                </Field.ErrorText>
              </Field.Root>
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
                <Field.ErrorText>
                  {errors.treatment_type?.message}
                </Field.ErrorText>
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
              <Field.Root
                invalid={!!errors.description}
                required
                px={4}
                w="full"
              >
                <Field.Label>Descripción</Field.Label>
                <Textarea
                  colorPalette="orange"
                  resize="none"
                  placeholder="Descripción del plan de cuidado"
                  variant="outline"
                  {...register("description")}
                />
                <Field.ErrorText>{errors.description?.message}</Field.ErrorText>
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
                  {...register("estimated_appointments", {
                    valueAsNumber: true,
                  })}
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
