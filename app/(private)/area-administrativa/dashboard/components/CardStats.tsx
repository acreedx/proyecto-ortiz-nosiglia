"use client";
import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import { FaCalendar } from "react-icons/fa";

interface CardStatsProps {
  label: string;
  value: number;
}

export default function CardStats({ label, value }: CardStatsProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="gray.200"
      bg="white"
      borderRadius="md"
      px={6}
      py={5}
      shadow="md"
      width="100%"
      maxW="280px"
      _dark={{ bg: "gray.800", borderColor: "gray.700" }}
    >
      <Flex
        align="center"
        justify="center"
        w="12"
        h="12"
        bg="orange.100"
        borderRadius="full"
        mb={4}
      >
        <Icon as={FaCalendar} color="orange.500" w={5} h={5} />
      </Flex>
      <Flex justify="space-between" align="flex-end">
        <Box>
          <Text
            fontSize="xl"
            fontWeight="bold"
            color="gray.800"
            _dark={{ color: "white" }}
          >
            {value}
          </Text>
          <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
            {label}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
}
