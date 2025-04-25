"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, TSignInSchema } from "../../lib/zod/zschemas";
import NavBar from "../index/navbar";
import { Input, Button, VStack, Field } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
export function SignIn() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TSignInSchema>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: TSignInSchema) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      toaster.create({
        description: "Usuario y contraseña incorrectos",
        type: "error",
      });
    } else {
      toaster.create({
        description: "Inicio de sesión exitoso",
        type: "success",
      });
      reset();
      router.push("/");
    }
    reset();
  };

  return (
    <VStack
      gap={4}
      align="stretch"
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      pt={40}
    >
      <NavBar />
      <h1>Inicio de sesión</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-[400px] items-center flex flex-col gap-4"
      >
        <Field.Root invalid={!!errors.username} required>
          <Field.Label>Username</Field.Label>
          <Input
            type="text"
            placeholder="tu@ejemplo.com"
            {...register("username", {
              required: "El usuario es requerido",
            })}
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} required mt={4}>
          <Field.Label>Password</Field.Label>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "El password es requerido",
            })}
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button
          mt={6}
          size="lg"
          colorPalette={"teal"}
          variant="solid"
          _hover={{ color: "white" }}
          type="submit"
          loading={isSubmitting}
        >
          Iniciar Sesión
        </Button>
      </form>
    </VStack>
  );
}
