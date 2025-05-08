"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, TSignInSchema } from "../../lib/zod/zschemas";
import { Input, Button, Field, Link, InputGroup } from "@chakra-ui/react";
import { toaster } from "../ui/toaster";
import { PasswordInput } from "../ui/password-input";
import { LuLock, LuUser } from "react-icons/lu";
import { getCaptchaToken } from "../../lib/captcha/validate-captcha";

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
    const token = await getCaptchaToken();
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      token: token,
      redirect: false,
    });

    if (res?.error) {
      if (res.code === "blocked") {
        toaster.create({
          description: "Usuario bloqueado, cambia tu contraseña para continuar",
          type: "info",
        });
        router.push("/olvido-de-password");
      } else if (res.code === "expired") {
        toaster.create({
          description:
            "Tu contraseña a expirado, cambiala para poder continuar",
          type: "info",
        });
        router.push("/olvido-de-password");
      } else if (res.code === "new") {
        toaster.create({
          description:
            "Usuario nuevo debe reestablecer su contraseña para poder continuar",
          type: "info",
        });
        router.push("/olvido-de-password");
      } else {
        toaster.create({
          description: "Usuario o contraseña incorrectos",
          type: "error",
        });
      }
    } else {
      toaster.create({
        description: "Inicio de sesión exitoso",
        type: "success",
      });
      reset();
      router.refresh();
    }
    reset();
  };

  return (
    <div className="w-full border-stroke xl:w-1/2 xl:border-l-2">
      <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
        <h1 className="mb-9 text-2xl font-bold text-black sm:text-title-xl2">
          Inicio de sesión
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field.Root invalid={!!errors.username} required mb={4}>
            <Field.Label className="mb-2.5 block font-medium text-black text-lg">
              Nombre de usuario
            </Field.Label>
            <div className="relative w-full">
              <InputGroup startElement={<LuUser />}>
                <Input
                  type="text"
                  placeholder="Ingresa tu nombre de usuario"
                  {...register("username", {
                    required: "El usuario es requerido",
                  })}
                  className="text-base h-12 w-full rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 text-black outline-none focus:border-orange-500 focus-visible:shadow-none"
                />
              </InputGroup>
            </div>
            <Field.ErrorText className="text-base">
              {errors.username?.message}
            </Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!errors.password} required mb={6}>
            <Field.Label className="mb-2.5 block font-medium text-black text-lg">
              Contraseña
            </Field.Label>
            <div className="relative w-full">
              <InputGroup startElement={<LuLock />}>
                <PasswordInput
                  type="password"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "El password es requerido",
                  })}
                  className="text-base h-12 w-full rounded-lg border border-stroke bg-transparent py-4 pl-12 pr-6 text-black outline-none focus:border-orange-500 focus-visible:shadow-none "
                />
              </InputGroup>
            </div>
            <Field.ErrorText className="text-base">
              {errors.password?.message}
            </Field.ErrorText>
          </Field.Root>
          <div className="mb-5">
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
          </div>
          <div>
            <Link
              href={"/olvido-de-password"}
              className="flex items-center justify-center gap-3.5 rounded-lg border border-stroke bg-gray-2 p-4 text-black hover:bg-opacity-50 no-underline"
            >
              Problemas para iniciar sesión?
            </Link>
          </div>
          <div className="mt-6 text-center">
            <p className="text-black">
              No tienes una cuenta?{" "}
              <Link
                href={"/crear-cuenta"}
                className="text-orange-400 hover:text-orange-500"
              >
                Registrate
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
