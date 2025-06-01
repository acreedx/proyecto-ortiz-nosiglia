"use client";
import { HStack, Field, Button, Input, Heading, Box } from "@chakra-ui/react";
import React from "react";
import {
  GenerateReportSchema,
  TGenerateReportSchema,
} from "../../../../../lib/zod/z-report-schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { toaster } from "../../../../../components/ui/toaster";

export default function CreateUsersReportForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(GenerateReportSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: TGenerateReportSchema) => {
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: "Esta seguro de generar este reporte?",
    });
    if (isConfirmed) {
      //todo cambiar para la server action de usuarios
      //const res = await patientReportData({
      //  data: data,
      //});
      //if (res.ok) {
      //  await reportePacientes({ data: data, pacientes: res.pacientes });
      //  toaster.create({
      //    description: "Reporte creado con éxito",
      //    type: "success",
      //  });
      //  reset();
      //} else {
      //  toaster.create({
      //    description: "Error al generar el reporte",
      //    type: "error",
      //  });
      //}
    }
  };
  return (
    <Box borderBottom="1px solid" borderColor="orange.300" p={4}>
      <Heading size={"md"} mb={4}>
        Reporte de citas
      </Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <HStack gap={4} mb={4} alignItems={"flex-start"}>
          <Field.Root invalid={!!errors.from}>
            <Field.Label>Fecha de inicio</Field.Label>
            <Input
              type="date"
              {...register("from")}
              variant={"outline"}
              colorPalette={"orange"}
            />
            <Field.ErrorText className="text-sm">
              {errors?.from?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!errors.to}>
            <Field.Label>Fecha de fin</Field.Label>
            <Input
              type="date"
              {...register("to")}
              variant={"outline"}
              colorPalette={"orange"}
            />
            <Field.ErrorText className="text-sm">
              {errors?.to?.message}
            </Field.ErrorText>
          </Field.Root>
        </HStack>
        <div className="flex flex-row justify-center">
          <Button
            colorPalette="orange"
            type="submit"
            loading={isSubmitting}
            size={"sm"}
            disabled={!!errors.from || !!errors.to}
          >
            Generar reporte en PDF
          </Button>
        </div>
      </form>
    </Box>
  );
}
