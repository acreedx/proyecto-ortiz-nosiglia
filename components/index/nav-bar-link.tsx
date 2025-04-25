"use client";
import React from "react";
import NextLink from "next/link";
import { Box, Link } from "@chakra-ui/react";
interface NavBarLinkProps {
  linkName: string;
  linkUrl: string;
}

const NavBarLink: React.FC<NavBarLinkProps> = ({ linkName, linkUrl }) => {
  return (
    <Box>
      <Link
        as={NextLink}
        color="gray.700"
        className="inline-block text-lg  no-underline drop-shadow-md transition duration-150 ease-in-out hover:text-orange-400 focus:shadow-none focus:outline-none"
        href={linkUrl}
        _hover={{ textDecoration: "none" }}
      >
        {linkName}
      </Link>
    </Box>
  );
};
export default NavBarLink;
