"use client";
import { useForm } from "react-hook-form";
import {
  Dialog,
  Flex,
  Button,
  CloseButton,
  useFileUpload,
  Field,
  Input,
  NativeSelect,
  Textarea,
  UseDialogReturn,
} from "@chakra-ui/react";
import React from "react";
import { Organization } from "@prisma/client";
import { toaster } from "../../../../../components/ui/toaster";
import { createPatient } from "../actions/operations";
import {
  CreatePatientSchema,
  TCreatePatientSchema,
} from "../../../../../lib/zod/z-patient-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import ProfileUploadField from "../../../../../components/form/common/profileUploadField";
import { GridApi, IDatasource } from "ag-grid-community";

export default function PatientCreateForm({
  props,
}: {
  props: {
    organizations: Organization[];
    dialog: UseDialogReturn;
    gridApiRef: React.RefObject<GridApi | null>;
    datasourceRef: React.RefObject<IDatasource | null>;
  };
}) {
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreatePatientSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TCreatePatientSchema) => {
    const res = await createPatient({
      data: data,
      image: fileUpload.acceptedFiles[0],
    });
    if (res.ok) {
      toaster.create({
        description: "Usuario creado con éxito",
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
    } else {
      toaster.create({
        description: res.message ? res.message : "Error al crear el usuario",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <Dialog.Header>
        <Dialog.Title>Crea un nuevo paciente</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <ProfileUploadField fileUpload={fileUpload} />
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Field.Root
            invalid={!!errors.identification}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Carnet de identidad</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el CI del paciente"
              {...register("identification", {
                required: "El CI es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.identification?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.first_name}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Nombres</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa los nombres del paciente"
              {...register("first_name", {
                required: "El nombre es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.first_name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.last_name}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Apellidos</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              autoComplete="family-name"
              variant="outline"
              placeholder="Ingresa los apellidos del paciente"
              {...register("last_name", {
                required: "Los apellidos son requeridos",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.last_name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.birth_date}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Fecha de nacimiento</Field.Label>
            <Input
              type="date"
              autoComplete="bday-day"
              variant="outline"
              placeholder="Ingresa la fecha de nacimiento del paciente"
              {...register("birth_date", {
                required: "La fecha de nacimiento es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.birth_date?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.phone}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Teléfono</Field.Label>
            <Input
              colorPalette="orange"
              autoComplete="tel"
              type="tel"
              variant="outline"
              placeholder="Ingresa el teléfono del paciente"
              {...register("phone", {
                required: "El teléfono es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.phone?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.mobile}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Celular</Field.Label>
            <Input
              autoComplete="mobile tel"
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa el celular del paciente"
              {...register("mobile", {
                required: "El celular es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.mobile?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.email}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Correo electrónico</Field.Label>
            <Input
              autoComplete="email"
              colorPalette="orange"
              type="email"
              variant="outline"
              placeholder="Ingresa el correo del paciente"
              {...register("email", {
                required: "El correo es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.email?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.address_line}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Dirección</Field.Label>
            <Input
              autoComplete="address-line1"
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la dirección del paciente"
              {...register("address_line", {
                required: "La dirección es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.address_line?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.address_city}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Ciudad</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la ciudad del paciente"
              {...register("address_city", {
                required: "La ciudad es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.address_city?.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root
            invalid={!!errors.organization_id}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Seguro</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona alguna organización registrada"
                colorPalette={"orange"}
                {...register("organization_id")}
              >
                {props.organizations.map((organization) => (
                  <option key={organization.id} value={organization.id}>
                    {organization.name}
                  </option>
                ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.organization_id?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.allergies}
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Alergias</Field.Label>
            <Textarea
              colorPalette="orange"
              autoComplete="address-line2"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa las alergias del paciente"
              {...register("allergies")}
            />
            <Field.ErrorText className="text-sm">
              {errors.allergies?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.allergies}
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Precondiciones</Field.Label>
            <Textarea
              colorPalette="orange"
              autoComplete="address-line2"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa las precondiciones del paciente"
              {...register("preconditions")}
            />
            <Field.ErrorText className="text-sm">
              {errors.preconditions?.message}
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
