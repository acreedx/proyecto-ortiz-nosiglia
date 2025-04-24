import Link from "next/link";
import React from "react";

export default function NavBar() {
  return (
    <nav className="w-full flex align-middle justify-center">
      <ul className="flex flex-row gap-4">
        <li>
          <Link href={"/"}>Login</Link>
        </li>
        <li>
          <Link href={"/protected-routes"}>Protected Route</Link>
        </li>
        <li>
          <Link href={"/protected-routes/protected-routes-just-admin"}>
            Protected Route for Admins
          </Link>
        </li>
      </ul>
    </nav>
  );
}
