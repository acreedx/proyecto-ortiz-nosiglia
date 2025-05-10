"use client";
import { Field, Flex, Input } from "@chakra-ui/react";
import React from "react";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import { toaster } from "../ui/toaster";
import { useForm } from "react-hook-form";
import SubmitButton from "./common/submitButton";
import {
  forgotPasswordSchema,
  TForgotPasswordSchema,
} from "../../lib/zod/z-sign-in-cycle-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPassword } from "../../actions/public";
import { getCaptchaToken } from "../../lib/captcha/validate-captcha";

export default function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TForgotPasswordSchema) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje: "Estas seguro que deseas reestablecer tu contraseña?",
      })
    ) {
      data.token = (await getCaptchaToken()) as string;
      const res = await forgotPassword({ data: data });
      if (res.ok) {
        toaster.create({
          description: "Contraseña reestablecida, revisa tu correo electrónico",
          type: "success",
        });
      }
      if (!res.ok) {
        toaster.create({
          description: res.message
            ? res.message
            : "Error al reestablecer al contraseña",
          type: "error",
        });
      }
      reset();
    }
  };
  return (
    <form className="h-full" onSubmit={handleSubmit(onSubmit)}>
      <Flex wrap="wrap" gapY={4} mb={4} w="full">
        <Field.Root
          invalid={!!errors.email}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Correo electrónico</Field.Label>
          <Input
            colorPalette="orange"
            type="email"
            variant="outline"
            placeholder="Ingresa tu correo electrónico"
            {...register("email", {
              required: "El correo electrónico es requerido",
            })}
            autoComplete="email"
          />
          <Field.ErrorText className="text-sm">
            {errors.email?.message}
          </Field.ErrorText>
        </Field.Root>
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
            autoComplete="username"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El nombre de usuario es requerido",
            })}
          />
          <Field.HelperText>
            El nombre de usuario es su carnet de identidad{" "}
          </Field.HelperText>
          <Field.ErrorText className="text-sm">
            {errors.username?.message}
          </Field.ErrorText>
        </Field.Root>
      </Flex>
      <SubmitButton
        text={"Reestablecer contraseña"}
        isSubmitting={isSubmitting}
      />
    </form>
  );
}
