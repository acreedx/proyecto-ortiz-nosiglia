export { auth as middleware } from "./lib/nextauth/auth";

export const config = {
  matcher: ["/protected-routes/:path*", "/area-administrativa/:path*"],
};
