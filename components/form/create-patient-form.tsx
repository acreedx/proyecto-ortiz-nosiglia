"use client";

import {
  Button,
  Field,
  FileUpload,
  FileUploadList,
  Flex,
  Float,
  Input,
  useFileUpload,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuFileImage, LuX } from "react-icons/lu";

export default function CreatePatientForm() {
  const fileUpload = useFileUpload({
    accept: "image/*",
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    resetField,
  } = useForm();
  const onSubmit = async (data) => {
    console.log(fileUpload.acceptedFiles);
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
      <FileUpload.RootProvider value={fileUpload}>
        <FileUpload.ItemGroup>
          {fileUpload.acceptedFiles.map((file) => (
            <FileUpload.Item
              w="auto"
              boxSize="20"
              p="2"
              file={file}
              key={file.name}
            >
              <FileUpload.ItemPreviewImage />
              <Float placement="top-end">
                <FileUpload.ItemDeleteTrigger
                  boxSize="4"
                  layerStyle="fill.solid"
                >
                  <LuX />
                </FileUpload.ItemDeleteTrigger>
              </Float>
            </FileUpload.Item>
          ))}
        </FileUpload.ItemGroup>
        <FileUpload.HiddenInput />
        <FileUpload.Trigger asChild>
          <Button variant="outline" size="sm">
            <LuFileImage /> Upload Images
          </Button>
        </FileUpload.Trigger>
        <FileUploadList />
      </FileUpload.RootProvider>
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
      <Button
        rounded={"xl"}
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
        Crear cuenta
      </Button>
    </form>
  );
}
