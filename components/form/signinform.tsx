"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, TSignInSchema } from "../../lib/zod/zschemas";
import NavBar from "../index/navbar";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
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

  const toast = useToast();
  const onSubmit = async (data: TSignInSchema) => {
    const res = await signIn("credentials", {
      ...data,
      redirect: false,
    });
    if (res?.error) {
      toast({
        description: "Usuario y contraseña incorrectos",
        status: "error",
      });
    } else {
      toast({
        description: "Inicio de sesión exitoso",
        status: "success",
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
        <FormControl isInvalid={!!errors.username} isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            type="text"
            placeholder="tu@ejemplo.com"
            {...register("username", {
              required: "El usuario es requerido",
            })}
          />
          <FormErrorMessage>{errors.username?.message}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.password} isRequired mt={4}>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="••••••••"
            {...register("password", {
              required: "El password es requerido",
            })}
          />
          <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
        </FormControl>

        <Button
          mt={6}
          size="lg"
          colorScheme="teal"
          variant="solid"
          type="submit"
          isLoading={isSubmitting}
        >
          Iniciar Sesión
        </Button>
      </form>
    </VStack>
  );
}
