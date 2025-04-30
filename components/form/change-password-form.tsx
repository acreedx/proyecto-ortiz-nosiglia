"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import { toaster } from "../ui/toaster";
import {
  changePasswordSchema,
  TChangePasswordSchema,
} from "../../lib/zod/zschemas";
import SubmitButton from "./common/submitButton";
import { Field, Flex, Input } from "@chakra-ui/react";

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
      toaster.create({
        description: "Contraseña actualizada con éxito",
        type: "success",
      });
      console.log(data);
      //TODO Agregar el cambio de contraseña del usuario
      //TODO Actualizar la sesión si se puede
      reset();
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
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El nombre de usuario es requerido",
            })}
          />
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
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu contraseña actual"
            {...register("actualPassword", {
              required: "El password actual es requerido",
            })}
          />
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
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nueva contraseña"
            {...register("newPassword", {
              required: "La nueva contraseña es requerida",
            })}
          />
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
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa la confirmación de tu nueva contraseña"
            {...register("newPasswordConfirmation", {
              required: "La confirmación es requerida",
            })}
          />
          <Field.ErrorText className="text-sm">
            {errors.newPasswordConfirmation?.message}
          </Field.ErrorText>
        </Field.Root>
      </Flex>
      <SubmitButton text="Confirmar" isSubmitting={isSubmitting} />
    </form>
  );
}
