import "./globals.css";

import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { metadata } from "../lib/metadata/metadata";
import { Toaster } from "../components/ui/toaster";
import Script from "next/script";

export { metadata };

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning lang="es">
      <body className={inter.className}>
        <Script
          strategy="beforeInteractive"
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_CAPTCHA_SITE_KEY}`}
        />
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
