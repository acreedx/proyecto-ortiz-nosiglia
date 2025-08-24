"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import { toaster } from "../ui/toaster";
import {
  changePasswordSchema,
  TChangePasswordSchema,
} from "../../lib/zod/z-sign-in-cycle-schemas";
import SubmitButton from "./common/submitButton";
import {
  Field,
  Flex,
  Image,
  Input,
  InputGroup,
  useFileUpload,
} from "@chakra-ui/react";
import { LuLock, LuUser } from "react-icons/lu";
import { PasswordInput } from "../ui/password-input";
import { changePassword } from "../../actions/public";
import { signOut } from "next-auth/react";
import ProfileUploadField from "./common/profileUploadField";
import { User } from "@prisma/client";
import formatDateLocal from "../../types/dateFormatter";

export default function ChangePasswordForm({ user }: { user: User }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
    defaultValues: {
      ...user,
      birth_date: formatDateLocal(user.birth_date),
    },
  });
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const onSubmit = async (data: TChangePasswordSchema) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje:
          "Estas seguro que deseas cambiar tu contraseña?, una vez cambiada se cerrará la sesión",
      })
    ) {
      const res = await changePassword({
        data: data,
        image: fileUpload.acceptedFiles[0],
      });
      if (res.ok) {
        toaster.create({
          description: "Contraseña actualizada con éxito",
          type: "success",
        });
        reset();
        signOut();
      }
      if (!res.ok) {
        toaster.create({
          description: "Error al actualizar la contraseña",
          type: "error",
        });
      }
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
      <input type="hidden" {...register("id")} />
      <div className="flex flex-row justify-center items-center mt-4 mb-4">
        <div className="h-full w-full flex flex-col items-center">
          <p className="mb-2 font-semibold">Foto de perfil actual</p>
          <Image
            alt="Foto de perfil actual"
            src={user.photo_url}
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
      </Flex>
      <Flex wrap="wrap" gapY={4} mb={4} w="full">
        <Field.Root
          invalid={!!errors.username}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Nombre de usuario</Field.Label>
          <InputGroup startElement={<LuUser />}>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa tu nombre de usuario"
              {...register("username", {
                required: "El nombre de usuario es requerido",
              })}
            />
          </InputGroup>
          <Field.ErrorText className="text-sm">
            {errors.username?.message}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.actualPassword}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Contraseña actual</Field.Label>
          <InputGroup startElement={<LuLock />}>
            <PasswordInput
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa tu contraseña actual"
              {...register("actualPassword", {
                required: "El password actual es requerido",
              })}
            />
          </InputGroup>
          <Field.ErrorText className="text-sm">
            {errors.actualPassword?.message}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.newPassword}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Nueva contraseña</Field.Label>
          <InputGroup startElement={<LuLock />}>
            <PasswordInput
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa tu nueva contraseña"
              {...register("newPassword", {
                required: "La nueva contraseña es requerida",
              })}
            />
          </InputGroup>
          <Field.ErrorText className="text-sm">
            {errors.newPassword?.message}
          </Field.ErrorText>
        </Field.Root>
        <Field.Root
          invalid={!!errors.newPasswordConfirmation}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Confirmación</Field.Label>
          <InputGroup startElement={<LuLock />}>
            <PasswordInput
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa la confirmación de tu contraseña"
              {...register("newPasswordConfirmation", {
                required: "La confirmación es requerida",
              })}
            />
          </InputGroup>
          <Field.ErrorText className="text-sm">
            {errors.newPasswordConfirmation?.message}
          </Field.ErrorText>
        </Field.Root>
      </Flex>
      <SubmitButton text="Confirmar" isSubmitting={isSubmitting} />
    </form>
  );
}
