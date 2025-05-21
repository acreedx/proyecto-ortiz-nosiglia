import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Badge,
  SimpleGrid,
  Spacer,
  Accordion,
  Span,
  Icon,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { FaFile } from "react-icons/fa";
import { userStatusList } from "../../../../../types/statusList";

const ImagingStudies = ({
  studies,
}: {
  studies: Prisma.ImagingStudyGetPayload<{
    include: {
      files: true;
    };
  }>[];
}) => {
  return (
    <Box p={6}>
      <VStack align="stretch" gap={6}>
        {studies.length <= 0 && (
          <div>El paciente no tiene radiografías registradas</div>
        )}
        {studies.map((study) => (
          <Box
            key={study.id}
            p={4}
            borderWidth="1px"
            borderRadius="lg"
            shadow="md"
          >
            <Heading size="md">{study.description}</Heading>
            <Text fontSize="sm" color="gray.500">
              Fecha del estudio:{" "}
              {study.created_at
                ? study.created_at?.toLocaleDateString()
                : "No registrado"}
            </Text>
            {study.status === userStatusList.ACTIVO && (
              <Badge colorPalette={"green"}>activo</Badge>
            )}
            {study.status === userStatusList.INACTIVO && (
              <Badge colorPalette={"red"}>inactivo</Badge>
            )}
            {study.description && (
              <Text mt={2} fontSize={"sm"}>
                {study.description}
              </Text>
            )}
            <Spacer my={2} />
            <Accordion.Root collapsible colorPalette={"orange"}>
              <Accordion.Item key={study.id} value={study.id.toString()}>
                <Accordion.ItemTrigger>
                  <Span flex="1" className="flex items-center" fontSize={"sm"}>
                    <Icon mr={2} fontSize="lg" color="fg.subtle">
                      <FaFile color="orange" />
                    </Icon>
                    Ver archivos
                  </Span>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} gap={4}>
                      {study.files.map((file) => (
                        <Box
                          key={file.id}
                          p={2}
                          borderWidth="1px"
                          borderRadius="md"
                          textAlign="center"
                          className="flex flex-col items-center justify-center"
                        >
                          <Link
                            href={file.media!}
                            color="blue.500"
                            fontWeight="semibold"
                            fontSize={"sm"}
                            target="_blank"
                          >
                            Ver archivo
                          </Link>
                          <Badge mt={1} colorScheme="gray" fontSize="xs">
                            {file.created_at
                              ? new Date(file.created_at).toLocaleDateString()
                              : "Fecha no registrada"}
                          </Badge>
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            </Accordion.Root>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default ImagingStudies;
