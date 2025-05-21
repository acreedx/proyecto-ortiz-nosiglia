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
  NativeSelect,
  Textarea,
} from "@chakra-ui/react";
import { toaster } from "../../../../../components/ui/toaster";
import { Organization, Prisma } from "@prisma/client";
import {
  EditPatientSchema,
  TEditPatientSchema,
} from "../../../../../lib/zod/z-patient-schemas";
import { userStatusList } from "../../../../../types/statusList";
import { editPatient } from "../actions/operations";

export default function EditPatientForm({
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
    organizations: Organization[];
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEditPatientSchema>({
    resolver: zodResolver(EditPatientSchema),
    mode: "onChange",
    defaultValues: {
      id: props.patient?.id,
      allergies: props.patient?.allergies ?? "",
      preconditions: props.patient?.preconditions ?? "",
      organization_id: props.patient?.organization_id
        ? props.patient?.organization_id
        : undefined,
    },
  });
  const onSubmit = async (data: TEditPatientSchema) => {
    const res = await editPatient({ data: data });
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
        <Dialog.Title>Edita la información del paciente</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full" flexDirection={"column"}>
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.allergies}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Alergias</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa las alergías del paciente"
              {...register("allergies")}
            />
            <Field.ErrorText className="text-sm">
              {errors?.allergies?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.preconditions}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Precondiciones</Field.Label>
            <Textarea
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa las precondiciones del paciente"
              {...register("preconditions")}
            />
            <Field.ErrorText className="text-sm">
              {errors.preconditions?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.organization_id}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Seguro</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Elige una opción"
                colorPalette={"orange"}
                {...register("organization_id")}
              >
                {props.organizations
                  .filter(
                    (org) =>
                      org.status === userStatusList.ACTIVO ||
                      org.id === props.patient?.organization_id
                  )
                  .map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name}
                    </option>
                  ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.organization_id?.message}
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
