"use client";

import { UseFileUploadContext } from "@ark-ui/react";
import { Button, FileUpload, Float } from "@chakra-ui/react";
import { LuX, LuUser } from "react-icons/lu";

export default function ProfileUploadField({
  fileUpload,
}: {
  fileUpload: UseFileUploadContext;
}) {
  return (
    <FileUpload.RootProvider
      value={fileUpload}
      colorPalette={"orange"}
      className="w-full flex items-center"
      mb={4}
    >
      <FileUpload.ItemGroup
        colorPalette={"orange"}
        display={"flex"}
        alignItems={"center"}
        bgColor={"white"}
      >
        {fileUpload.acceptedFiles.map((file) => (
          <FileUpload.Item
            w="auto"
            boxSize="40"
            p="2"
            file={file}
            key={file.name}
            colorPalette={"orange"}
            bgColor={"gray.200"}
          >
            <FileUpload.ItemPreviewImage
              colorPalette={"orange"}
              rounded={"full"}
              bgColor={"orange.200"}
              w={"full"}
              h={"full"}
            />
            <Float placement="top-end">
              <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid">
                <LuX />
              </FileUpload.ItemDeleteTrigger>
            </Float>
          </FileUpload.Item>
        ))}
      </FileUpload.ItemGroup>
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button
          variant="subtle"
          size="sm"
          bgColor={"orange.400"}
          color={"white"}
          _hover={{ bgColor: "orange.500" }}
        >
          <LuUser /> Sube tu foto de perfil
        </Button>
      </FileUpload.Trigger>
    </FileUpload.RootProvider>
  );
}
