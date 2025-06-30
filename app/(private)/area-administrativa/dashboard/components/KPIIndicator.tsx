"use client";
import { Box, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { LuFileClock } from "react-icons/lu";

export default function KPIIndicator({
  texto,
  valor,
  medida,
}: {
  texto: string;
  valor: number;
  medida: string;
}) {
  const formatoValor = Number.isInteger(valor)
    ? valor.toString()
    : valor.toFixed(2);
  return (
    <Box
      p={4}
      borderRadius="lg"
      boxShadow="md"
      bg="white"
      textAlign="center"
      maxW="200px"
    >
      <Icon as={LuFileClock} boxSize={6} color="orange.500" mb={2} />
      <Text fontWeight="medium" fontSize="sm">
        {texto}
      </Text>
      <Text fontSize="2xl" fontWeight="bold">
        {formatoValor} {medida}
      </Text>
    </Box>
  );
}
