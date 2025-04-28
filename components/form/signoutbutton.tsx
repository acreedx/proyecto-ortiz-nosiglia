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
        size="lg"
        height={14}
        border="1px"
        borderColor="orange.500"
        bg="orange.400"
        color={"white"}
        variant="solid"
        _hover={{ bg: "orange.400", opacity: 0.9 }}
        type="submit"
      >
        Sign Out
      </Button>
    </form>
  );
}
