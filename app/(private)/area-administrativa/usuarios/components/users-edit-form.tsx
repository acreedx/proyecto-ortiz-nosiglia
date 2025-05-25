"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Flex,
  Image,
  Input,
  NativeSelect,
  useFileUpload,
} from "@chakra-ui/react";
import { toaster } from "../../../../../components/ui/toaster";
import { Prisma, Role } from "@prisma/client";
import { edit } from "../actions/operations";
import {
  EditUserSchema,
  TEditUserSchema,
} from "../../../../../lib/zod/z-user-schemas";
import formatDateLocal from "../../../../../types/dateFormatter";
import ProfileUploadField from "../../../../../components/form/common/profileUploadField";
import { userStatusList } from "../../../../../types/statusList";

export default function UsersEditForm({
  props,
}: {
  props: {
    user:
      | Prisma.UserGetPayload<{
          include: {
            role: true;
          };
        }>
      | undefined;
    roles: Role[];
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
    resolver: zodResolver(EditUserSchema),
    mode: "onChange",
    defaultValues: {
      ...props.user,
      birth_date: props.user?.birth_date
        ? formatDateLocal(props.user?.birth_date)
        : undefined,
      rol_id: props.user?.role_id,
      identification: String(props.user?.identification ?? ""),
      phone: String(props.user?.phone ?? ""),
      mobile: String(props.user?.mobile ?? ""),
    },
  });
  const onSubmit = async (data: TEditUserSchema) => {
    const res = await edit({ data: data, image: fileUpload.acceptedFiles[0] });
    if (res.ok) {
      toaster.create({
        description: "Usuario editado con éxito",
        type: "success",
      });
    } else {
      toaster.create({
        description: res.errorMessage
          ? res.errorMessage
          : "Error al editar el usuario",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Editar un usuario</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <div className="flex flex-row justify-center items-center mt-4 mb-4">
          <div className="h-full w-full flex flex-col items-center">
            <p className="mb-2 font-semibold">Foto de perfil actual</p>
            <Image
              alt="Foto de perfil actual"
              src={props.user?.photo_url}
              w={40}
              h={40}
              colorPalette={"orange"}
              rounded={"full"}
              bgColor={"orange.200"}
            />
          </div>
          <ProfileUploadField fileUpload={fileUpload} />
        </div>
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
              placeholder="Ingresa tu CI"
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
              autoComplete="given-name"
              variant="outline"
              placeholder="Ingresa tus nombres"
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
              placeholder="Ingresa tus apellidos"
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
              placeholder="Ingresa tu fecha de nacimiento"
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
              placeholder="Ingresa tu teléfono fijo"
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
              placeholder="Ingresa tu celular"
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
              placeholder="Ingresa tu correo"
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
              placeholder="Ingresa tu dirección"
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
              autoComplete="address-line2"
              type="text"
              variant="outline"
              placeholder="Ingresa tu ciudad"
              {...register("address_city", {
                required: "La ciudad es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.address_city?.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root
            invalid={!!errors.rol_id}
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Rol</Field.Label>
            <NativeSelect.Root size={"md"}>
              <NativeSelect.Field
                placeholder="Selecciona algún rol registrado"
                colorPalette={"orange"}
                {...register("rol_id")}
              >
                {props.roles
                  .filter(
                    (rol) =>
                      rol.status === userStatusList.ACTIVO ||
                      rol.id === props.user?.role_id
                  )
                  .map((rol) => (
                    <option key={rol.id} value={rol.id}>
                      {rol.role_name}
                    </option>
                  ))}
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText className="text-sm">
              {errors.rol_id?.message}
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
