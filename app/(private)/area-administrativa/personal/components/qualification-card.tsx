"use client";
import {
  VStack,
  Badge,
  IconButton,
  Text,
  Flex,
  Box,
  SimpleGrid,
  useDialog,
} from "@chakra-ui/react";
import { Qualification } from "@prisma/client";
import React, { useState } from "react";
import { FaTrash, FaArchive, FaEdit } from "react-icons/fa";
import { toaster } from "../../../../../components/ui/toaster";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { userStatusList } from "../../../../../types/statusList";
import { eliminate, restore } from "../actions/operations";
import EditDialog from "../../../../../components/admin/dialog/edit-dialog";
import QualificationEditForm from "./qualification-edit-form";

export default function QualificationCard({
  qualifications,
}: {
  qualifications: Qualification[];
}) {
  const editdialog = useDialog();
  const [selectedQualification, setselectedQualification] =
    useState<Qualification>();
  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
      {qualifications.map((qualification) => (
        <Box
          key={qualification.id}
          borderWidth="1px"
          borderRadius="xl"
          p={4}
          boxShadow="sm"
        >
          {" "}
          <VStack align="start" gap={1}>
            <Text fontWeight="bold">Nombre: {qualification.name}</Text>
            <Text fontSize={"sm"}>
              Institución: {qualification.institution}
            </Text>
            <Text fontSize={"sm"}>País: {qualification.country}</Text>
            <Text fontSize={"sm"}>Tipo: {qualification.type}</Text>
            <Text fontSize={"sm"}>
              Fecha de obtención:{" "}
              {new Intl.DateTimeFormat("es-ES", {
                day: "numeric",
                month: "numeric",
                year: "numeric",
                timeZone: "UTC",
              }).format(new Date(qualification.obtainment_date))}
            </Text>
            <Badge
              colorPalette={
                qualification.status === userStatusList.ACTIVO ? "green" : "red"
              }
            >
              {qualification.status === userStatusList.ACTIVO
                ? "activo"
                : "inactivo"}
            </Badge>
            <Flex gap={2}>
              {qualification.status === userStatusList.ACTIVO && (
                <IconButton
                  colorPalette={"red"}
                  size={"sm"}
                  px={2}
                  onClick={async () => {
                    const isConfirmed = await mostrarAlertaConfirmacion({
                      mensaje: "Esta seguro de deshabilitar este título?",
                    });
                    if (isConfirmed) {
                      const res = await eliminate({ id: qualification.id });
                      if (res.ok) {
                        toaster.create({
                          description: "Éxito al deshabilitar el título",
                          type: "success",
                        });
                      } else {
                        toaster.create({
                          description: "Error al deshabilitar el título",
                          type: "error",
                        });
                      }
                    }
                  }}
                >
                  <FaTrash color="white" /> Deshabilitar
                </IconButton>
              )}

              {qualification.status === userStatusList.ACTIVO && (
                <IconButton
                  colorPalette={"orange"}
                  px={2}
                  onClick={async () => {
                    editdialog.setOpen(true);
                    setselectedQualification(qualification);
                  }}
                  size={"sm"}
                >
                  <FaEdit color="white" /> Editar
                </IconButton>
              )}
              {qualification.status === userStatusList.INACTIVO && (
                <IconButton
                  colorPalette={"green"}
                  px={2}
                  size={"sm"}
                  onClick={async () => {
                    const isConfirmed = await mostrarAlertaConfirmacion({
                      mensaje: "Esta seguro de rehabilitar este título?",
                    });
                    if (isConfirmed) {
                      const res = await restore({ id: qualification.id });
                      if (res.ok) {
                        toaster.create({
                          description: "Éxito al rehabilitar el título",
                          type: "success",
                        });
                      } else {
                        toaster.create({
                          description: "Error al rehabilitar el título",
                          type: "error",
                        });
                      }
                    }
                  }}
                >
                  <FaArchive color="white" /> Rehabilitar
                </IconButton>
              )}
            </Flex>
          </VStack>
        </Box>
      ))}
      <EditDialog dialog={editdialog}>
        <QualificationEditForm
          props={{
            qualification: selectedQualification,
          }}
        />
      </EditDialog>
    </SimpleGrid>
  );
}
