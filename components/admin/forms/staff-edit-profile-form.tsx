"use client";

import { Field, Flex, Image, Input, useFileUpload } from "@chakra-ui/react";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { mostrarAlertaConfirmacion } from "../../../lib/sweetalert/alerts";
import {
  createUserSchema,
  TCreateUserSchema,
} from "../../../lib/zod/zpublicschemas";
import ProfileUploadField from "../../form/common/profileUploadField";
import SubmitButton from "../../form/common/submitButton";
import { toaster } from "../../ui/toaster";

export default function EditProfileForm({ user }: { user: User }) {
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
    defaultValues: {
      ...user,
      birth_date: new Date(user.birth_date).toISOString().split("T")[0],
    },
  });
  const onSubmit = async (data: TCreateUserSchema) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje: "Confirmas los datos de tu usuario?",
      })
    ) {
      //TODO actualizar el paciente
      toaster.create({
        description: "Usuario actualizado con éxito",
        type: "success",
      });
      console.log(data);
      //TODO actualizar la sesion
    }
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full flex flex-col mx-4 md:mx-20 xl:mx-40"
    >
      <div className="flex flex-row justify-center items-center mt-4 mb-4">
        <div className="h-full w-full flex flex-col items-center ">
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
      <div className="w-full flex flex-col items-center">
        <SubmitButton text={"Actualizar"} isSubmitting={isSubmitting} />
      </div>
    </form>
  );
}
