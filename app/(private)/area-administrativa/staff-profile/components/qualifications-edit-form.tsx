import {
  Dialog,
  Flex,
  Field,
  Button,
  CloseButton,
  Input,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Qualification } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toaster } from "../../../../../components/ui/toaster";
import {
  TEditQualificationSchema,
  EditQualificationSchema,
} from "../../../../../lib/zod/z-qualification-schemas";
import formatDateLocal from "../../../../../types/dateFormatter";
import { editQualification } from "../../personal/actions/operations";

export default function QualificationEditForm({
  props,
}: {
  props: {
    qualification: Qualification | undefined;
  };
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TEditQualificationSchema>({
    resolver: zodResolver(EditQualificationSchema),
    mode: "onChange",
    defaultValues: {
      id: props.qualification?.id,
      country: props.qualification?.country ?? undefined,
      institution: props.qualification?.institution,
      name: props.qualification?.name,
      type: props.qualification?.type,
      obtainment_date: props.qualification?.obtainment_date
        ? formatDateLocal(props.qualification.obtainment_date)
        : undefined,
    },
  });
  const onSubmit = async (data: TEditQualificationSchema) => {
    const res = await editQualification({ data: data });
    if (res.ok) {
      toaster.create({
        description: "Información del título editada con éxito",
        type: "success",
      });
    }
    if (!res.ok) {
      toaster.create({
        description: "Error al editar la información del título",
        type: "error",
      });
      reset();
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Dialog.Header>
        <Dialog.Title>Edita el título del dentista</Dialog.Title>
      </Dialog.Header>
      <Dialog.Body>
        <Flex wrap="wrap" gapY={4} mb={4} w="full" flexDirection={"column"}>
          <Input type="hidden" {...register("id")} />
          <Field.Root
            invalid={!!errors.name}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Nombre del título</Field.Label>
            <Input
              type="text"
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa el nombre del título"
              {...register("name", {
                required: "El nombre es requerido",
              })}
            />
            <Field.ErrorText className="text-sm">
              {errors?.name?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.institution}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Institución</Field.Label>
            <Input
              type="text"
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa la institución del título"
              {...register("institution")}
            />
            <Field.ErrorText className="text-sm">
              {errors.institution?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.country}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>País</Field.Label>
            <Input
              type="text"
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa el país del título"
              {...register("country")}
            />
            <Field.ErrorText className="text-sm">
              {errors.country?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.type}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Tipo</Field.Label>
            <Input
              type="text"
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa el tipo del título"
              {...register("type")}
            />
            <Field.ErrorText className="text-sm">
              {errors.type?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root
            invalid={!!errors.obtainment_date}
            required
            px={4}
            w={{ base: "100%", md: "100%" }}
          >
            <Field.Label>Fecha de obtención</Field.Label>
            <Input
              type="date"
              colorPalette="orange"
              resize={"none"}
              variant="outline"
              placeholder="Ingresa la fecha de obtención del título"
              {...register("obtainment_date")}
            />
            <Field.ErrorText className="text-sm">
              {errors.obtainment_date?.message}
            </Field.ErrorText>
          </Field.Root>
        </Flex>
      </Dialog.Body>
      <Dialog.Footer>
        <Dialog.ActionTrigger asChild>
          <Button variant="outline">Cancelar</Button>
        </Dialog.ActionTrigger>
        <Button type="submit" loading={isSubmitting}>
          Editar
        </Button>
      </Dialog.Footer>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>
    </form>
  );
}
