"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Input,
} from "@chakra-ui/react";
import { toaster } from "../../../../../components/ui/toaster";
import { Prisma } from "@prisma/client";
import { editEmergencyContact } from "../actions/operations";
import {
  EditEmergencyContact,
  TEditEmergencyContact,
} from "../../../../../lib/zod/z-emergency-contact";

export default function EmergencyContactEditForm({
  props,
}: {
  props: {
    patient:
      | Prisma.PatientGetPayload<{
          include: {
            emergency_contact: true;
          };
        }>
      | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(EditEmergencyContact),
    mode: "onChange",
    defaultValues: {
      ...props.patient?.emergency_contact,
      id: props.patient?.id.toString(),
    },
  });
  const onSubmit = async (data: TEditEmergencyContact) => {
    const res = await editEmergencyContact({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Información del paciente editada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al editar la información del paciente",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>
          Edita el contacto de emergencia del paciente
        </Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full" flexDirection={"column"}>
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.relation}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Relación familiar</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la relación del contacto con el paciente"
              {...register("relation")}
            />
            <Field.ErrorText className="text-sm">
              {errors?.relation?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.name}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Nombre</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el nombre del contacto del paciente"
              {...register("name")}
            />
            <Field.ErrorText className="text-sm">
              {errors.name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.phone}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Teléfono</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el teléfono del contacto del paciente"
              {...register("phone")}
            />
            <Field.ErrorText className="text-sm">
              {errors.phone?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.mobile}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Celular</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el celular del contacto del paciente"
              {...register("mobile")}
            />
            <Field.ErrorText className="text-sm">
              {errors.mobile?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.address_line}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Dirección</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la dirección del contacto del paciente"
              {...register("address_line")}
            />
            <Field.ErrorText className="text-sm">
              {errors.address_line?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.address_city}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Ciudad</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la ciudad del contacto del paciente"
              {...register("address_city")}
            />
            <Field.ErrorText className="text-sm">
              {errors.address_city?.message}
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
