import { Button } from "@chakra-ui/react";
import { signOut } from "../../lib/nextauth/auth";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button
        width="full"
        mt={6}
        cursor={"pointer"}
        size="lg"
        rounded={"lg"}
        height={14}
        border="1px"
        borderColor="orange.500"
        bg="orange.400"
        p="4"
        color={"white"}
        _hover={{ bg: "orange.400", opacity: 0.9 }}
        type="submit"
      >
        Cerrar Sesión
      </Button>
    </form>
  );
}
