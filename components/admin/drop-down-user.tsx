import Link from "next/link";
import { Avatar, Button, Menu, Portal } from "@chakra-ui/react";
import { LuUser } from "react-icons/lu";
import { auth } from "../../lib/nextauth/auth";
import LogOutButton from "./logoutbutton";
import { rolesList } from "../../lib/nextauth/rolesList";
import { FaGraduationCap } from "react-icons/fa";

export default async function DropdownUser() {
  const session = await auth();
  return (
    <div>
      {session && session.user && (
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="xl">
              <span className="hidden text-right lg:block">
                <span className="block text-sm font-medium text-black dark:text-white">
                  {`${session.user.first_name} ${session.user.last_name}`}
                </span>
                <span className="block text-xs text-black dark:text-white">
                  {session.user.role}
                </span>
              </span>

              <span className="rounded-full">
                <Avatar.Root size={"md"}>
                  <Avatar.Fallback
                    name={`${session.user.first_name}-${session.user.last_name}`}
                  />
                  <Avatar.Image src={session.user.photo_url} />
                </Avatar.Root>
              </span>
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="profile">
                  <Link
                    href={`/area-administrativa/staff-profile`}
                    className="flex items-center gap-3.5 text-sm font-medium duration-150 ease-in-out hover:text-orange-500 lg:text-base"
                  >
                    <LuUser />
                    Editar tu perfil
                  </Link>
                </Menu.Item>
                {(session.user.role === rolesList.DENTISTA ||
                  session.user.role === rolesList.MEDICO_TEMPORAL) && (
                  <Menu.Item value="qualifications">
                    <Link
                      href={`/area-administrativa/staff-profile/titulos`}
                      className="flex items-center gap-3.5 text-sm font-medium duration-150 ease-in-out hover:text-orange-500 lg:text-base"
                    >
                      <FaGraduationCap />
                      Editar tus títulos
                    </Link>
                  </Menu.Item>
                )}
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 w-full  dark:border-strokedark"></ul>
                <Menu.Item value="log-out">
                  <LogOutButton />
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Portal>
        </Menu.Root>
      )}
    </div>
  );
}
