"use client";
import {
  Field,
  Flex,
  Input,
  NativeSelect,
  Textarea,
  useFileUpload,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../lib/sweetalert/alerts";
import ProfileUploadField from "./common/profileUploadField";
import SubmitButton from "./common/submitButton";
import {
  createUserSchema,
  TCreateUserSchema,
} from "../../lib/zod/z-sign-in-cycle-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toaster } from "../ui/toaster";
import { createUser } from "../../actions/public";
import { useRouter } from "next/navigation";
import { getCaptchaToken } from "../../lib/captcha/validate-captcha";
import { Organization } from "@prisma/client";

export default function CreatePatientForm({
  organizations,
}: {
  organizations: Organization[];
}) {
  const router = useRouter();
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createUserSchema),
    mode: "onChange",
  });
  const onSubmit = async (data: TCreateUserSchema) => {
    if (
      await mostrarAlertaConfirmacion({
        mensaje: "Confirmas los datos de tu usuario?",
      })
    ) {
      data.token = (await getCaptchaToken()) as string;
      const res = await createUser({
        data: data,
        image: fileUpload.acceptedFiles[0],
      });
      if (res.ok) {
        toaster.create({
          title: "Usuario creado con éxito",
          description:
            "Cambia tu contraseña mientras hayas iniciado sesión, sino deberás reestablecerla",
          type: "success",
          duration: 8000,
        });
        reset();
        router.push("/login");
      }
      if (!res.ok) {
        toaster.create({
          description: "Error al crear el usuario",
          type: "error",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="h-full">
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
          invalid={!!errors.allergies}
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Alergias</Field.Label>
          <Textarea
            colorPalette="orange"
            variant="outline"
            placeholder="Ingresa las alergias que tengas"
            resize={"none"}
            {...register("allergies")}
          />
          <Field.ErrorText className="text-sm">
            {errors.allergies?.message}
          </Field.ErrorText>
        </Field.Root>

        <Field.Root
          invalid={!!errors.preconditions}
          px={4}
          w={{ base: "100%", md: "50%" }}
        >
          <Field.Label>Precondiciones</Field.Label>
          <Textarea
            colorPalette="orange"
            variant="outline"
            placeholder="Ingresa tus precondiciones"
            resize={"none"}
            {...register("preconditions")}
          />
          <Field.ErrorText className="text-sm">
            {errors.preconditions?.message}
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
              placeholder="Cuentas con algun seguro registrado"
              colorPalette={"orange"}
              {...register("organization_id")}
            >
              {organizations.map((organization) => (
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
      </Flex>
      <SubmitButton text={"Crear cuenta"} isSubmitting={isSubmitting} />
    </form>
  );
}
