"use client";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  FileUpload,
  Flex,
  Input,
  Text,
  useFileUpload,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuFile } from "react-icons/lu";
import {
  CreateImagingStudySchema,
  TCreateImagingStudySchema,
} from "../../../../../lib/zod/z-imaging-study-schemas";
import { create } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";

export default function ImagingStudiesCreateForm({
  props,
}: {
  props: { patientId: number };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(CreateImagingStudySchema),
    mode: "onChange",
    defaultValues: {
      patient_id: props.patientId,
    },
  });
  const fileUpload = useFileUpload({
    accept: ["image/*", "application/pdf"],
    maxFiles: 5,
    maxFileSize: 5242880,
    required: true,
  });
  const onSubmit = async (data: TCreateImagingStudySchema) => {
    const res = await create({ data: data, files: fileUpload.acceptedFiles });
    if (res.ok) {
      toaster.create({
        description: "Estudio creado con éxito",
        type: "success",
      });
      fileUpload.clearFiles();
      reset();
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al crear el estudio",
        type: "error",
      });
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Crea un estudio radiográfico</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full">
          <Field.Root
            invalid={!!errors.description}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Descripción</Field.Label>
            <Input
              colorPalette="orange"
              type="text"
              variant="outline"
              placeholder="Ingresa una descripción"
              {...register("description", {
                required: "La descripción es requerida",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.description?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.cost}
            required
            px={4}
            w={{ base: "100%", md: "50%" }}
          >
            <Field.Label>Costo</Field.Label>
            <Input
              colorPalette="orange"
              type="number"
              variant="outline"
              placeholder="Ingresa un costo"
              {...register("cost", {
                required: "El costo es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors.cost?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
        <FileUpload.RootProvider
          value={fileUpload}
          colorPalette={"orange"}
          className="w-full flex items-center "
        >
          <FileUpload.Trigger asChild>
            <Button
              variant="subtle"
              size="sm"
              bgColor={"orange.400"}
              color={"white"}
              _hover={{ bgColor: "orange.500" }}
            >
              <LuFile /> Elegir los archivos del estudio
            </Button>
          </FileUpload.Trigger>
          <Text>
            Debe elegir un máximo de 5 archivos, con un tamaño de hasta 5Mb cada
            uno
          </Text>
          <FileUpload.ItemGroup
            colorPalette={"orange"}
            display={"flex"}
            alignItems={"center"}
            bgColor={"white"}
          >
            <FileUpload.Context>
              {({ acceptedFiles }) =>
                acceptedFiles.map((file, index) => (
                  <FileUpload.Item key={index} file={file}>
                    <FileUpload.ItemPreview />
                    <FileUpload.ItemName />
                    <FileUpload.ItemSizeText />
                    <FileUpload.ItemDeleteTrigger />
                  </FileUpload.Item>
                ))
              }
            </FileUpload.Context>
          </FileUpload.ItemGroup>
          <FileUpload.HiddenInput />
        </FileUpload.RootProvider>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Crear
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
