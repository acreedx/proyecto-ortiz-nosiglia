import { Box, Flex, Text, Link as ChakraLink, Heading } from "@chakra-ui/react";
import NextImage from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <Box as="footer" className="footer img-bg" pt="100px" pb="100px">
      <Box
        mx="auto"
        w="full"
        px="0.75rem"
        maxW={{
          base: "540px",
          md: "720px",
          lg: "960px",
          xl: "1140px",
          "2xl": "1320px",
        }}
      >
        <Box className="footer-widget-wrapper" mb="120px">
          <Flex flexWrap="wrap" justify="center" mx="-0.75rem">
            {/* Logo y descripción */}
            <Box
              mt="40px"
              w="full"
              px="16"
              maxW="full"
              flexShrink={0}
              md={{ w: "50%" }}
              lg={{ w: "5/12" }}
              xl={{ w: "1/3" }}
            >
              <Box
                className="footer-widget"
                display="flex"
                flexDir="column"
                alignItems="center"
              >
                <ChakraLink
                  href="/"
                  className="logo"
                  _hover={{ color: "#00adb5" }}
                >
                  <NextImage
                    src="/images/logo/logo.png"
                    alt="Logo del centro Ortiz Nosiglia"
                    width={110}
                    height={110}
                    className="max-w-full transform transition-transform duration-300 hover:scale-105"
                  />
                </ChakraLink>
                <Text
                  className="text-[18px] text-[#8c96a7]"
                  textAlign="justify"
                  mt="4"
                  mb="4"
                >
                  El centro odontológico Ortiz Nosiglia es un centro dedicado a
                  brindar servicios de odontología a toda la población
                </Text>
                <Box className="footer-social-links">
                  <ul className="list-none m-0 p-0">
                    <li>
                      <ChakraLink
                        href="https://www.facebook.com/ortiznosiglia"
                        className="inline-block"
                      >
                        <i className="lni lni-facebook-fill"></i>
                      </ChakraLink>
                    </li>
                    <li>
                      <ChakraLink
                        href="https://www.tiktok.com/@ortiznosiglia"
                        className="inline-block"
                      >
                        <i className="lni lni-tiktok-alt"></i>
                      </ChakraLink>
                    </li>
                    <li>
                      <ChakraLink
                        href="https://www.instagram.com/ortiznosiglia/"
                        className="inline-block"
                      >
                        <i className="lni lni-instagram-original"></i>
                      </ChakraLink>
                    </li>
                  </ul>
                </Box>
              </Box>
            </Box>

            {/* Links */}
            <Box
              className="footer-widget"
              w={{ md: "50%", lg: "25%", xl: "16.66%" }}
              mr={{ sm: "1", md: "0" }}
            >
              <Heading
                as="h4"
                className="font-raleway text-[25px]"
                color="#393e46"
                mb="4"
              >
                Links
              </Heading>
              <ul className="footer-links list-none m-0 p-0">
                <li>
                  <ChakraLink
                    href="#"
                    className="text-white hover:text-orange-400 inline-block"
                  >
                    Inicio
                  </ChakraLink>
                </li>
                <li>
                  <ChakraLink
                    href="#services"
                    className="text-white hover:text-orange-400 inline-block"
                  >
                    Servicios
                  </ChakraLink>
                </li>
                <li>
                  <ChakraLink
                    href="#"
                    className="text-white hover:text-orange-400 inline-block"
                  >
                    Contacto
                  </ChakraLink>
                </li>
              </ul>
            </Box>

            {/* Servicios */}
            <Box
              className="footer-widget"
              w={{ md: "5/12", lg: "25%", xl: "16.66%" }}
            >
              <Heading
                as="h4"
                className="font-raleway text-[25px]"
                color="#393e46"
                mb="4"
              >
                Servicios
              </Heading>
              <ul className="footer-links list-none m-0 p-0">
                {[
                  "Implantes Dentales",
                  "Carillas - Coronas",
                  "Ortodoncia Tradicional",
                  "Ortodoncia Invisible",
                  "Odontopediatría",
                  "Tratamiento Anti Ronquidos",
                ].map((servicio) => (
                  <li key={servicio}>
                    <Link
                      href="#services"
                      className="text-white hover:text-orange-400 inline-block"
                    >
                      {servicio}
                    </Link>
                  </li>
                ))}
              </ul>
            </Box>

            {/* Mapa */}
            <Box
              className="footer-widget"
              w={{ md: "7/12", lg: "100%", xl: "33.33%" }}
              textAlign="center"
            >
              <Heading
                as="h4"
                className="font-raleway text-[25px]"
                color="#393e46"
                mb="4"
              >
                Ubicación del centro
              </Heading>
              <Box className="map-canvas">
                <iframe
                  className="map"
                  id="gmap_canvas"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.6860226115905!2d-68.08588148831532!3d-16.541941341742554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f219a0459807d%3A0xc6f594b962363dc0!2sConsultorio%20Dental%20Ortiz%20Nosiglia!5e0!3m2!1ses-419!2sbo!4v1726956035506!5m2!1ses-419!2sbo"
                  width="100%"
                  height="250"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
}
