import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Centro Ortiz Nosiglia",
  description: "Este es el sitio web del Centro Odontológico Ortiz Nosiglia",
  keywords: [
    "odontología",
    "Ortiz Nosiglia",
    "centro odontológico",
    "salud dental",
  ],
  authors: [
    { name: "Centro Odontológico Ortiz Nosiglia" },
    { name: "Dr. Fernando Ortiz Nosiglia" },
    { name: "Dr. Álvaro Ortiz Nosiglia" },
    { name: "Dr. Javier Ortiz Nosiglia" },
  ],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Centro Odontológico Ortiz Nosiglia",
    description: "Este es el sitio web del Centro Odontológico Ortiz Nosiglia",
    url: "https://www.centroortiznosiglia.com",
    type: "website",
    images: [
      {
        url: "https://www.centroortiznosiglia.com/image.jpg",
        width: 800,
        height: 600,
        alt: "Centro Odontológico Ortiz Nosiglia",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@centro_ortiz",
    title: "Centro Ortiz Nosiglia",
    description: "Este es el sitio web del Centro Odontológico Ortiz Nosiglia",
    images: ["https://www.centroortiznosiglia.com/image.jpg"],
  },
  icons: {
    icon: "/icon.ico",
    apple: "/icon.ico",
  },
  alternates: {
    canonical: "https://www.centroortiznosiglia.com",
    languages: {
      en: "https://www.centroortiznosiglia.com/en",
      es: "https://www.centroortiznosiglia.com/es",
    },
  },
};
