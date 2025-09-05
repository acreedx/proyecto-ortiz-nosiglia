import "./globals.css";

import { Inter, Open_Sans, Raleway } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { metadata } from "../lib/metadata/metadata";
import { Toaster } from "../components/ui/toaster";
import Script from "next/script";

export { metadata };

const inter = Inter({ subsets: ["latin"] });
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-open-sans",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-raleway",
});
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="es"
      className={`${openSans.variable} ${raleway.variable}`}
    >
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
