"use client";
import {
  FileUpload,
  Icon,
  Box,
  Field,
  Table,
  Tabs,
  useFileUpload,
  Accordion,
  Span,
  Button,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import SubmitButton from "../../../../../components/form/common/submitButton";
import * as XLSX from "xlsx";
import { useState } from "react";
import { FaFile } from "react-icons/fa";
import { mostrarAlertaConfirmacion } from "../../../../../lib/sweetalert/alerts";
import { createPatients } from "../actions/operations";
import { toaster } from "../../../../../components/ui/toaster";

export type ImportPatient = {
  fechaFiliacion: Date | undefined;
  apellidoPaterno: string | undefined;
  apellidoMaterno: string | undefined;
  primerNombre: string | undefined;
  segundoNombre: string | undefined;
  fechaDeNacimiento: Date | undefined;
  lugarDeNacimiento: string | undefined;
  carnetDeIdentidad: string | undefined;
  direccion: string | undefined;
  telefono: string | undefined;
  celular: string | undefined;
  email: string | undefined;
  referidoPor: string | undefined;
  motivoDeConsulta: string | undefined;
  alergias: string | undefined;
};
export default function DropZone() {
  const fileUpload = useFileUpload({
    accept: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
    onFileAccept(details) {
      setExcelFiles([]);
      for (let i = 0; i < details.files.length; i++) {
        const file = details.files[i];
        const reader = new FileReader();
        reader.onload = (e) => {
          const buffer = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(buffer, {
            type: "array",
            cellDates: true,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const sheetsData: { [key: string]: any[][] } = {};
          for (let i = 0; i < 1; i++) {
            const sheetName = workbook.SheetNames[i];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {
              header: 1,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }) as any[][];
            const cleanedData = jsonData
              .filter((row) =>
                row.some((cell) =>
                  typeof cell === "string"
                    ? cell.trim() !== ""
                    : cell !== null && cell !== undefined
                )
              )
              .map((row) =>
                row.filter((cell) =>
                  typeof cell === "string"
                    ? cell.trim() !== ""
                    : cell !== null && cell !== undefined
                )
              );
            sheetsData[sheetName] = cleanedData;
          }
          setExcelFiles((prev) => [
            ...prev,
            {
              fileName: file.name,
              sheets: sheetsData,
            },
          ]);
        };
        reader.readAsArrayBuffer(file);
      }
    },
    required: true,
    maxFiles: 10000,
  });
  const [excelFiles, setExcelFiles] = useState<
    {
      fileName: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sheets: { [key: string]: any[][] };
    }[]
  >([]);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const modelPage1 = {
    "FECHA FILIACION": "",
    "APELLIDO PATERNO": "",
    "APELLIDO MATERNO": "",
    "PRIMER NOMBRE": "",
    "SEGUNDO NOMBRE": "",
    "FECHA DE NACIMIENTO": "",
    "LUGAR DE NACIMIENTO": "",
    "CARNET DE IDENTIDAD": "",
    "DIRECCIÓN/ZONA": "",
    TELÉFONO: "",
    CELULAR: "",
    EMAIL: "",
    "REFERIDO POR": "",
    "MOTIVO DE CONSULTA": "",
    "ALERGIA ALGUN MEDICAMENTO:": "",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  const onSubmit = async (data: any) => {
    const formatedData = excelFiles.map((file) => {
      const firstSheetName = Object.keys(file.sheets)[0];
      const sheet = file.sheets[firstSheetName];
      const result: Record<string, string> = { ...modelPage1 };
      sheet.forEach((row) => {
        const key = String(row[0]).trim().toUpperCase();
        const value = row[1];
        if (key in result) {
          result[key] = value ? String(value).trim() : value;
        }
      });
      return result;
    });
    const pacientes: ImportPatient[] = formatedData.map((element) => ({
      fechaFiliacion: new Date(element["FECHA FILIACION"]),
      apellidoPaterno: element["APELLIDO PATERNO"],
      apellidoMaterno: element["APELLIDO MATERNO"],
      primerNombre: element["PRIMER NOMBRE"],
      segundoNombre: element["SEGUNDO NOMBRE"],
      fechaDeNacimiento: new Date(element["FECHA DE NACIMIENTO"]),
      lugarDeNacimiento: element["LUGAR DE NACIMIENTO"],
      carnetDeIdentidad: element["CARNET DE IDENTIDAD"],
      direccion: element["DIRECCIÓN/ZONA"],
      telefono: element["TELÉFONO"],
      celular: element["CELULAR"],
      email: element["EMAIL"],
      referidoPor: element["REFERIDO POR"],
      motivoDeConsulta: element["MOTIVO DE CONSULTA"],
      alergias: element["ALERGIA ALGUN MEDICAMENTO:"],
    }));
    const isConfirmed = await mostrarAlertaConfirmacion({
      mensaje: `Esta seguro de subir los ${pacientes.length} archivos`,
    });
    if (isConfirmed) {
      const res = await createPatients({
        data: pacientes,
      });
      if (res.ok) {
        toaster.create({
          description: "Éxito al importar los pacientes",
          type: "success",
        });
      } else {
        toaster.create({
          description: "Error al importar los pacientes",
          type: "error",
        });
      }
    }
  };
  const tabNames = [
    "Filacion",
    "Odontograma",
    "Seguimiento",
    "Contable",
    "Presupuesto",
    "Laboratorios",
  ];
  return (
    <div className="pt-4 flex flex-col justify-center md:flex-row">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="items-center p-4 md:w-1/2"
      >
        <Field.Root>
          <FileUpload.RootProvider alignItems="stretch" value={fileUpload}>
            <FileUpload.HiddenInput
              required
              {...register("files", {
                required: "Selecciona algun archivo para empezar",
              })}
            />
            <FileUpload.Dropzone>
              <Icon size="md" color="fg.muted">
                <LuUpload />
              </Icon>
              <FileUpload.DropzoneContent>
                <Box>Selecciona y arrastra los archivos aqui</Box>
                <Box color="fg.muted">formato .xls, .xlsx hasta 5MB</Box>
              </FileUpload.DropzoneContent>
            </FileUpload.Dropzone>
            <Field.ErrorText className="text-sm"></Field.ErrorText>

            <FileUpload.ItemGroup
              colorPalette={"orange"}
              display={"flex"}
              alignItems={"center"}
              bgColor={"white"}
              maxHeight={"500px"}
              overflowY={"scroll"}
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
          </FileUpload.RootProvider>
        </Field.Root>
        <SubmitButton text="Extraer datos" isSubmitting={isSubmitting} />
        <Button
          colorPalette={"orange"}
          onClick={() => {
            fileUpload.clearFiles();
          }}
          rounded={"xl"}
          ml={"2"}
        >
          Limpiar
        </Button>
      </form>
      <div className="p-4 md:w-1/2">
        {excelFiles.map((excelFile, index) => (
          <Accordion.Root key={index} collapsible colorPalette={"orange"}>
            <Accordion.Item value={index.toString()}>
              <Accordion.ItemTrigger>
                <Span flex="1" className="flex items-center" fontSize={"sm"}>
                  <Icon mr={2} fontSize="lg" color="fg.subtle">
                    <FaFile color="orange" />
                  </Icon>
                  {excelFile.fileName}
                </Span>
                <Accordion.ItemIndicator />
              </Accordion.ItemTrigger>
              <Accordion.ItemContent>
                <Accordion.ItemBody>
                  {Object.keys(excelFile.sheets).length > 0 && (
                    <Tabs.Root defaultValue={Object.keys(excelFile.sheets)[0]}>
                      <Tabs.List>
                        {Object.keys(excelFile.sheets).map(
                          (sheetName, index) => {
                            const tabLabel = tabNames[index] || sheetName;
                            return (
                              <Tabs.Trigger key={sheetName} value={tabLabel}>
                                {tabLabel}
                              </Tabs.Trigger>
                            );
                          }
                        )}
                      </Tabs.List>
                      {Object.entries(excelFile.sheets).map(
                        ([sheetName, sheetData], index) => {
                          const tabLabel = tabNames[index] || sheetName;
                          return (
                            <Tabs.Content key={sheetName} value={tabLabel}>
                              <Box overflowX="auto" mt={4}>
                                <Table.Root variant="outline" size="sm">
                                  <Table.Header>
                                    <Table.Row>
                                      {sheetData[0]?.map((_, index) => (
                                        <Table.ColumnHeader key={index}>
                                          Col {index + 1}
                                        </Table.ColumnHeader>
                                      ))}
                                    </Table.Row>
                                  </Table.Header>
                                  <Table.Body>
                                    {sheetData.map((row, rowIndex) => (
                                      <Table.Row key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                          <Table.Cell key={cellIndex}>
                                            {String(cell)}
                                          </Table.Cell>
                                        ))}
                                      </Table.Row>
                                    ))}
                                  </Table.Body>
                                </Table.Root>
                              </Box>
                            </Tabs.Content>
                          );
                        }
                      )}
                    </Tabs.Root>
                  )}
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>
        ))}
      </div>
    </div>
  );
}
