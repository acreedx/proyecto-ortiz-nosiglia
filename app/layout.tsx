import "./globals.css";
import "./styles/animate.css";
import "./styles/LineIcons.css";
import "./styles/tiny-slider.css";
import "./styles/footer.css";
import "./styles/main.css";
import { Inter } from "next/font/google";
import { Provider } from "../components/ui/provider";
import Header from "../components/common/header";
import FloatingButton from "../components/common/floating-button";
import { metadata } from "../lib/metadata/metadata";
import Footer from "../components/common/footer";
import { Toaster } from "../components/ui/toaster";
import NavBar from "../components/index/nav-bar";

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
          <Header />
          <NavBar />
          {children}
          <Footer />
          <FloatingButton />
          <Toaster />
        </Provider>
      </body>
    </html>
  );
}
