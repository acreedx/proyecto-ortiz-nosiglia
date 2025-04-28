import "./globals.css";
import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { metadata } from "../lib/metadata/metadata";
import { Toaster } from "../components/ui/toaster";

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
        <Provider>
          {children}
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
