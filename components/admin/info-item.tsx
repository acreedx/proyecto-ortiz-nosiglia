"use client";
import { Box, Text } from "@chakra-ui/react";
import React from "react";

export interface InfoItemProps {
  label: string;
  value?: string;
}

export function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Box>
      <Text fontSize="xs" fontWeight="bold" textTransform="uppercase">
        {label}
      </Text>
      <Text>{value || "—"}</Text>
    </Box>
  );
}
export default InfoItem;
