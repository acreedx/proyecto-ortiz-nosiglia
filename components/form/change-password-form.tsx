"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import { toaster } from "../ui/toaster";
import {
  changePasswordSchema,
  TChangePasswordSchema,
} from "../../lib/zod/zpublicschemas";
import SubmitButton from "./common/submitButton";
import { Field, Flex, Input, InputGroup } from "@chakra-ui/react";
import { LuLock, LuUser } from "react-icons/lu";
import { PasswordInput } from "../ui/password-input";
import { changePassword } from "../../actions/public";

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TChangePasswordSchema) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje: "Estas seguro que deseas cambiar tu contraseña?",
      })
    ) {
      const res = await changePassword({ data: data });
      if (res.ok) {
        toaster.create({
          description: "Contraseña actualizada con éxito",
          type: "success",
        });
        reset();
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
