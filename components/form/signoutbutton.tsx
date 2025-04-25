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
      <Button size="xl" colorPalette="teal" variant="solid" type="submit">
        Sign Out
      </Button>
    </form>
  );
}
