import { Button } from "@chakra-ui/react";
import React from "react";

export default function SubmitButton({
  text,
  isSubmitting,
}: {
  text: string;
  isSubmitting: boolean;
}) {
  return (
    <Button
      rounded={"xl"}
      mt={6}
      size="lg"
      height={14}
      border="1px"
      borderColor="orange.500"
      bg="orange.400"
      color={"white"}
      variant="solid"
      _hover={{ bg: "orange.400", opacity: 0.9 }}
      type="submit"
      loading={isSubmitting}
    >
      {text}
    </Button>
  );
}
