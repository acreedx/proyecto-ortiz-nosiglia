"use client";
import {
  Dialog,
  Flex,
  Field,
  Textarea,
  Button,
  CloseButton,
  Input,
  Heading,
  Box,
  Avatar,
  Stack,
  Text,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Prisma } from "@prisma/client";
import React from "react";
import { EditAppointmentSchema } from "../../../../../lib/zod/z-appointment-schemas";
import { useForm } from "react-hook-form";
import { formatDateTimeLocal } from "../../../../../types/dateFormatter";

export default function AppointmentsViewForm({
  props,
}: {
  props: {
    selectedAppointment:
      | Prisma.AppointmentGetPayload<{
          include: {
            patient: {
              include: {
                user: true;
              };
            };
            doctor: {
              include: {
                staff: {
                  include: {
                    user: true;
                  };
                };
              };
            };
          };
        }>
      | undefined;
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
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            {props.selectedAppointment?.patient ? (
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
                        src={props.selectedAppointment.patient.user.photo_url}
                        alt={`Foto de ${props.selectedAppointment.patient.user.first_name} ${props.selectedAppointment.patient.user.last_name}`}
                      />
                      <Avatar.Fallback>
                        {props.selectedAppointment.patient.user.first_name.charAt(
                          0
                        )}
                        {props.selectedAppointment.patient.user.last_name.charAt(
                          0
                        )}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <Text fontWeight="bold" fontSize="lg">
                      {props.selectedAppointment.patient.user.first_name}{" "}
                      {props.selectedAppointment.patient.user.last_name}
                    </Text>

                    <Box w="full">
                      <Text>
                        <strong>C.I.:</strong>{" "}
                        {props.selectedAppointment.patient.user.identification}
                      </Text>
                      <Text>
                        <strong>Dirección:</strong>{" "}
                        {props.selectedAppointment.patient.user.address_line},{" "}
                        {props.selectedAppointment.patient.user.address_city}
                      </Text>
                      <Text>
                        <strong>Correo:</strong>{" "}
                        {props.selectedAppointment.patient.user.email}
                      </Text>
                      <Text>
                        <strong>Teléfono:</strong>{" "}
                        {props.selectedAppointment.patient.user.phone}
                      </Text>
                      <Text>
                        <strong>Celular:</strong>{" "}
                        {props.selectedAppointment.patient.user.mobile}
                      </Text>
                      <Text>
                        <strong>Fecha de nacimiento:</strong>{" "}
                        {new Date(
                          props.selectedAppointment.patient.user.birth_date
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
          </div>
        </div>
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
