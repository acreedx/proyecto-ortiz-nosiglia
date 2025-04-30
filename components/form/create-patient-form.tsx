"use client";
import { Field, Flex, Input, useFileUpload } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import ProfileUploadField from "./common/profileUploadField";
import SubmitButton from "./common/submitButton";

export default function CreatePatientForm() {
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje: "Confirmas los datos de tu usuario?",
      })
    ) {
      console.log("datos");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="h-full"
    >
      <ProfileUploadField fileUpload={fileUpload} />
      <Flex wrap="wrap" gapY={4} mb={4} w="full">
        <Field.Root
          invalid={!!errors.username}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Username</Field.Label>
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El usuario es requerido",
            })}
          />
          <Field.ErrorText className="text-base">
            {/*errors.username?.message*/}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root
          invalid={!!errors.username}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Username</Field.Label>
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El usuario es requerido",
            })}
          />
          <Field.ErrorText className="text-base">
            {/*errors.username?.message*/}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root
          invalid={!!errors.username}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Username</Field.Label>
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El usuario es requerido",
            })}
          />
          <Field.ErrorText className="text-base">
            {/*errors.username?.message*/}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root
          invalid={!!errors.username}
          required
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Username</Field.Label>
          <Input
            colorPalette="orange"
            type="text"
            variant="outline"
            placeholder="Ingresa tu nombre de usuario"
            {...register("classname", {
              required: "El usuario es requerido",
            })}
          />
          <Field.ErrorText className="text-base">
            {/*errors.username?.message*/}
          </Field.ErrorText>
        </Field.Root>
      </Flex>
      <SubmitButton text={"Crear cuenta"} isSubmitting={isSubmitting} />
    </form>
  );
}
