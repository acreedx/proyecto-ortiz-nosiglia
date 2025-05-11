"use client";
import { FileUpload, Icon, Box, Field, Table } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { LuUpload } from "react-icons/lu";
import SubmitButton from "../../form/common/submitButton";
import * as XLSX from "xlsx";
import { useState } from "react";

export default function DropZone() {
  const [excelData, setExcelData] = useState<any[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    mode: "onChange",
  });
  const onSubmit = async (data: any) => {
    const file = data.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      console.log(sheetName);
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      console.log("Datos:", jsonData);
      setExcelData(jsonData);
    };
    reader.readAsArrayBuffer(file);
  };
  return (
    <div className="pt-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Field.Root>
          <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={10}>
            <FileUpload.HiddenInput
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
            <FileUpload.List />
          </FileUpload.Root>
        </Field.Root>
        <SubmitButton text="Aceptar" isSubmitting={isSubmitting} />
      </form>
      {excelData.length > 0 && (
        <Table.Root
          border={1}
          style={{ marginTop: "20px", borderCollapse: "collapse" }}
          variant={"outline"}
        >
          <Table.Header>
            <Table.Row>
              {Object.keys(excelData[0]).map((key) => (
                <Table.ColumnHeader key={key} style={{ padding: "8px" }}>
                  {key}
                </Table.ColumnHeader>
              ))}
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {excelData.map((row, index) => (
              <Table.Row key={index}>
                {Object.values(row).map((value, i) => (
                  <Table.Cell key={i} style={{ padding: "8px" }}>
                    {String(value)}
                  </Table.Cell>
                ))}
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
    </div>
  );
}
