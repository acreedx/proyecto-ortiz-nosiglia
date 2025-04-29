"use client";

import { Button, Field, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";

export default function CreatePatientForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    reset();
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field.Root invalid={!!errors.username} required mb={4}>
          <Field.Label className="mb-2.5 block font-medium text-black text-lg">
            Username
          </Field.Label>
          <Input
            type="text"
            placeholder="Ingresa tu nombre de usuario"
            {...register("username", {
              required: "El usuario es requerido",
            })}
            className="text-base h-12 w-full rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 text-black outline-none focus:border-orange-500 focus-visible:shadow-none"
          />
          <Field.ErrorText className="text-base">
            {/*errors.username?.message*/}
          </Field.ErrorText>
        </Field.Root>
        <Button
          width="full"
          mt={6}
          size="lg"
          height={14}
          border="1px"
          borderColor="orange.500"
          bg="orange.400"
          color={"white"}
          variant="solid"
          _hover={{ bg: "orange.400", opacity: 0.9 }}
          type="submit"
          loading={isSubmitting}
        >
          Iniciar Sesión
        </Button>
      </form>
    </div>
  );
}
