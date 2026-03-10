"use client";
import { Box, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export interface ActionCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  title: string;
  description: string;
  href: string;
}

export function ActionCard({
  icon,
  title,
  description,
  href,
}: ActionCardProps) {
  return (
    <Link href={href}>
      <Box
        p={6}
        borderRadius="2xl"
        bg="white"
        boxShadow="sm"
        _hover={{
          boxShadow: "md",
          transform: "translateY(-2px)",
        }}
        transition="all"
        cursor="pointer"
        className="dark:bg-boxdark"
      >
        <Flex direction="column" gap={4}>
          <Box
            bg="orange.50"
            w="fit-content"
            p={3}
            borderRadius="xl"
            color="orange.500"
          >
            <Icon as={icon} boxSize={6} />
          </Box>
          <Box>
            <Heading size="md">{title}</Heading>
            <Text color="gray.500" fontSize="sm">
              {description}
            </Text>
          </Box>
        </Flex>
      </Box>
    </Link>
  );
}
export default ActionCard;
