import Image from "next/image";
import React from "react";
import { FaTooth, FaSmileBeam, FaChild, FaBed } from "react-icons/fa";
import { GiTooth, GiInvisible } from "react-icons/gi";
import DentistIcon from "../../components/icons/dentist-icon";
import HouseIcon from "../../components/icons/house-icon";
import SecretaryIcon from "../../components/icons/secretary-icon";
import TouchIcon from "../../components/icons/touch-icon";
import Contact from "../../components/index/contact";
import DropDownCard from "../../components/index/drop-down-card";
import ServiceCard from "../../components/index/service-card";
import Slider from "../../components/index/slider";

export default function Page() {
  return (
    <main>
      <Slider />
      <section className="we-do-section bg-white pt-[150px]">
        <div className="shape shape-1">
          <Image
            className="max-w-full"
            src="/images/paginaweb/shapes/shape-1.svg"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="mx-auto xl:w-2/3">
              <div className="section-title mb-[55px] text-center">
                <span
                  className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-semibold text-orange-400 no-underline"
                  data-wow-delay=".2s"
                >
                  Que hacemos
                </span>
                <h2
                  className="wow fadeInUp m-0 mb-2 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-[#393e46] md:text-[2rem]"
                  data-wow-delay=".4s"
                >
                  Proveemos para tu salud
                </h2>
                <p
                  className="wow fadeInUp m-0 text-center text-[18px] font-normal leading-[28px] text-[#8c96a7]"
                  data-wow-delay=".6s"
                >
                  En Ortiz Nosiglia, nos dedicamos a cuidar de tu bienestar,
                  ofreciendo servicios médicos de alta calidad y un equipo de
                  profesionales comprometidos con tu salud. Nuestro objetivo es
                  brindar atención personalizada y garantizar que recibas el
                  tratamiento adecuado para tus necesidades. Creemos que la
                  prevención es la clave, y por eso estamos aquí para
                  acompañarte en cada paso de tu cuidado médico, desde
                  diagnósticos precisos hasta tratamientos efectivos.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="flex justify-center xl:w-full">
              <div className="graph mb-[60px]">
                <Image
                  className="max-w-full"
                  src="/images/paginaweb/we-do/graph-img.svg"
                  alt=""
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="we-do-item mb-[30px]">
                <div className="we-do-icon mb-25 flex items-center justify-center">
                  <DentistIcon />
                </div>
                <h5 className="m-0 font-raleway text-[20px] font-semibold text-[#393e46]">
                  Dentistas especialistas
                </h5>
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="we-do-item mb-[30px]">
                <div className="we-do-icon mb-25 flex items-center justify-center">
                  <SecretaryIcon />
                </div>
                <h5 className="m-0 font-raleway text-[20px] font-semibold text-[#393e46]">
                  Visitas Frecuentes
                </h5>
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="we-do-item mb-[30px]">
                <div className="we-do-icon mb-25 flex items-center justify-center">
                  <TouchIcon />
                </div>
                <h5 className="m-0 font-raleway text-[20px] font-semibold text-[#393e46]">
                  Administración cordial
                </h5>
              </div>
            </div>
            <div className="lg:w-1/4">
              <div className="we-do-item mb-[30px]">
                <div className="we-do-icon mb-25 flex items-center justify-center">
                  <HouseIcon />
                </div>
                <h5 className="m-0 font-raleway text-[20px] font-semibold text-[#393e46]">
                  Tratamientos especializados
                </h5>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="about" className="about-section bg-white pt-[120px]">
        <div className="shape top-0">
          <Image
            className="max-w-full"
            src="/images/paginaweb/shapes/shape-2.svg"
            alt="Imagen"
            width={400}
            height={400}
          />
        </div>
        <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="mx-auto lg:w-11/12 xl:w-5/6">
              <div className="about-content mb-[55px] text-center">
                <div className="section-title mb-[30px]">
                  <span
                    className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-semibold text-orange-400 no-underline"
                    data-wow-delay=".2s"
                  >
                    Acerca de nosotros
                  </span>
                  <h2
                    className="wow fadeInUp m-0 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-[#393e46] md:text-[2rem]"
                    data-wow-delay=".4s"
                  >
                    Bienvenido a nuestra clínica
                  </h2>
                </div>
                <p
                  className="wow fadeInUp m-0 mb-[35px] text-[18px] font-normal leading-[28px] text-[#8c96a7]"
                  data-wow-delay=".6s"
                >
                  En Ortiz Nosiglia, estamos orgullosos de contar con un equipo
                  altamente capacitado y comprometido con la salud bucal de
                  nuestros pacientes. Nuestro equipo está compuesto por
                  profesionales con amplia experiencia en distintas áreas de la
                  odontología, brindando atención personalizada y de alta
                  calidad en cada visita.
                </p>
                <a
                  href={"/nuestro-equipo"}
                  className="inline-block rounded-md border border-transparent bg-transparent  px-3 py-1.5  text-base font-normal leading-6 text-current text-orange-500 no-underline shadow-md transition-colors duration-300 ease-out hover:text-orange-700 focus:shadow-none  focus:outline-none disabled:pointer-events-none disabled:opacity-65"
                  data-wow-delay=".8s"
                >
                  Conoce a nuestro equipo
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="about-img flex justify-center text-center">
          <Image
            className="h-full w-auto max-w-full px-0 xl:px-55"
            src="/images/paginaweb/team.png"
            alt=""
            width={400}
            height={400}
          />
        </div>
      </section>
      <section id="services" className="service-section bg-white pt-[150px]">
        <div className="shape shape-3">
          <Image
            className="max-w-full"
            src="/images/paginaweb/shapes/shape-3.svg"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="mx-auto w-full justify-center px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:mx-auto 2xl:max-w-full">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="mx-auto xl:w-2/3">
              <div className="section-title mb-[55px] text-center">
                <span
                  className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-semibold text-orange-400 no-underline"
                  data-wow-delay=".2s"
                >
                  Servicios
                </span>
                <h2
                  className="wow fadeInUp m-0 mb-2 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-[#393e46] md:text-[2rem]"
                  data-wow-delay=".4s"
                >
                  Nuestros servicios dentales
                </h2>
                <p
                  className="wow fadeInUp m-0 text-[18px] font-normal leading-[28px] text-[#8c96a7]"
                  data-wow-delay=".6s"
                >
                  En Ortiz Nosiglia, ofrecemos una amplia gama de servicios
                  dentales diseñados para satisfacer todas tus necesidades de
                  salud bucal. Desde limpiezas y chequeos rutinarios hasta
                  tratamientos especializados como ortodoncia, implantología y
                  estética dental, nuestro equipo de expertos está comprometido
                  a brindarte atención de calidad.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-[calc(1.0rem*0.5)] -mt-[0rem] flex flex-wrap justify-center gap-4">
            <ServiceCard
              title="Implantes Dentales"
              description="Los implantes dentales son tornillos de titanio que se colocan en el hueso maxilar con el fin de sustituir a las raíces de las piezas perdidas."
              iconComponent={<FaTooth color="orange" size={48} />}
            />
            <ServiceCard
              title="Carillas - Coronas"
              description="Mejora la apariencia de tu boca. Ofrecemos carillas y coronas impresas con sistema CAD CAM, las que son confeccionadas en una impresora digital, llevando al máximo la calidad y la fiabilidad."
              iconComponent={<FaSmileBeam color="orange" size={48} />}
            />
            <ServiceCard
              title="Ortodoncia Tradicional"
              description="Utilizamos una técnica que disminuye las visitas a la consulta en un lapso corto. Ofrecemos brackets estéticos y efectivos que benefician la sonrisa y salud oral."
              iconComponent={<GiTooth color="orange" size={48} />}
            />
            <ServiceCard
              title="Ortodoncia Invisible"
              description="La ortodoncia invisible (Invisalign) consiste en férulas transparentes removibles situadas en la parte externa de los dientes y que son prácticamente imperceptibles a la vista."
              iconComponent={<GiInvisible color="orange" size={48} />}
            />
            <ServiceCard
              title="Odontopediatría"
              description="El tratamiento a menores es importante por su enfoque de “tratamiento preventivo”, crucial porque marcará el futuro de la salud dental para toda la vida del infante."
              iconComponent={<FaChild color="orange" size={48} />}
            />
            <ServiceCard
              title="Tratamiento Anti Ronquidos"
              description="Con nuestro tratamiento anti-ronquido ayudamos a corregir la posición de la mandíbula durante el sueño, mejorando considerablemente el paso del aire y la oxigenación en la sangre del paciente."
              iconComponent={<FaBed color="orange" size={48} />}
            />
          </div>
        </div>
      </section>
      <Contact />
      <section className="faq-section bg-orange-400">
        <div className="faq-video-wrapper">
          <div className="faq-video">
            <iframe
              className="max-w-full shadow-xl"
              width="560"
              height="315"
              src="https://www.youtube.com/embed/IC2iHLmZNCM?si=gvZyrTpo23D4VHkN"
              title="Video player de Youtube"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>
        <div className="shape">
          <Image
            src="/images/paginaweb/shapes/shape-8.svg"
            alt="figura"
            width={400}
            height={400}
            className="shape-faq max-w-full"
          />
        </div>
        <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="mt-[0rem] w-full max-w-full flex-shrink-0 px-[calc(1.5rem*0.5)] md:w-10/12 lg:w-2/3 xl:ml-auto xl:w-1/2">
              <div className="faq-content-wrapper pb-[90px] pt-[90px]">
                <div className="section-title">
                  <span
                    className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-bold text-white no-underline"
                    data-wow-delay=".2s"
                  >
                    Preguntas frecuentes
                  </span>
                  <h2
                    className="wow fadeInUp m-0 mb-8 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-white md:text-[2rem]"
                    data-wow-delay=".4s"
                  >
                    Consigue las respuestas que quieres
                  </h2>
                </div>
                <div className="faq-wrapper accordion">
                  <DropDownCard
                    title="¿Que es el centro Ortiz Nosiglia?"
                    content="El Centro Ortiz Nosiglia es una institución dental dedicada a proporcionar atención integral y de calidad a nuestros pacientes.
                Nuestro equipo de profesionales altamente capacitados utiliza tecnología avanzada y técnicas actualizadas para asegurar 
                que cada visita sea una experiencia positiva. En el Centro Ortiz Nosiglia, nuestra misión es cuidar de tu salud bucal y contribuir a tu bienestar general."
                  />
                  <DropDownCard
                    title="¿Qué tratamientos ofrecen en el centro Ortiz Nosiglia?"
                    content="Ofrecemos una amplia gama de tratamientos dentales, que incluyen: limpiezas, ortodoncia, implantología, blanqueamiento dental, y cuidados pediátricos. Nos esforzamos por brindar atención personalizada según las necesidades de cada paciente."
                  />
                  <DropDownCard
                    title="¿Es necesario hacer una cita para recibir atención?"
                    content="Sí, recomendamos agendar una cita para garantizar que podamos atenderte de la mejor manera posible. Puedes hacer tu cita a través de nuestro sitio web o llamándonos directamente."
                  />
                  <DropDownCard
                    title="¿Cuál es la política de cancelación de citas?"
                    content="Si necesitas cancelar o reprogramar tu cita, te pedimos que nos avises con al menos 24 horas de anticipación. Esto nos permitirá atender a otros pacientes que necesiten nuestros servicios."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact />
      <section id="blog" className="blog-section bg-white">
        <div className="shape shape-7">
          <Image
            className="max-w-full"
            src="/images/paginaweb/shapes/shape-6.svg"
            alt=""
            width={400}
            height={400}
          />
        </div>
        <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
            <div className="mx-auto xl:w-2/3">
              <div className="section-title mb-[55px] text-center">
                <span
                  className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-semibold text-orange-400 no-underline"
                  data-wow-delay=".2s"
                >
                  Descuentos
                </span>
                <h2
                  className="wow fadeInUp m-0 mb-2 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-[#393e46] md:text-[2rem]"
                  data-wow-delay=".4s"
                >
                  Descuentos recientes
                </h2>
                <p
                  className="wow fadeInUp m-0 text-[18px] font-normal leading-[28px] text-[#8c96a7]"
                  data-wow-delay=".4s"
                >
                  En el Centro Ortiz Nosiglia, nos comprometemos a hacer que la
                  atención dental de calidad sea accesible para todos. Por eso,
                  ofrecemos una variedad de descuentos y promociones especiales
                  en nuestros tratamientos.
                </p>
              </div>
            </div>
          </div>
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap justify-center">
            <div className="mt-[0rem] w-full max-w-full flex-shrink-0 px-[calc(1.5rem*0.5)] md:w-1/2 lg:w-1/3 xl:w-1/3">
              <div
                className="single-blog wow fadeInUp mb-[30px]"
                data-wow-delay=".2s"
              >
                <div className="blog-img">
                  <a
                    href="#"
                    className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                  >
                    <Image
                      className="max-w-full"
                      src="/images/paginaweb/promociones.jpg"
                      alt="Promociones"
                      width={400}
                      height={400}
                    />
                  </a>
                </div>
                <div className="blog-content rounded-xl p-4 shadow-lg">
                  <h4 className="m-0 font-raleway text-[25px] font-semibold text-[#393e46]">
                    <a
                      href="#"
                      className="inline-block no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                    >
                      REGALOS por el mes del amor y la amistad
                    </a>
                  </h4>
                  <div className="m-0  text-[18px] font-normal leading-[28px] text-black ">
                    <p className="font-bold">
                      PERIODO: Del 16 de septiembre al 15 de octubre de 2024
                    </p>

                    <div className="space-y-1">
                      <p className="font-semibold">1.- Día del estudiante</p>
                      <p className="pl-4">
                        2x1 En limpieza dental (incluye fluor y ultrasonido)
                      </p>
                      <p className="pl-4">
                        Limpieza dental pensada en los peques (desde los 6 hasta
                        los 14 años) y sus papás y mamás
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-semibold">2.- Día del amor</p>
                      <p className="pl-4">2x1 en blanqueamiento dental</p>
                      <p className="pl-4">
                        ¡Celebra el día del amor junto a tu pareja con una
                        sonrisa espectacular!
                      </p>
                    </div>

                    <div className="space-y-1">
                      <p className="font-semibold">3.- Día de la primavera!</p>
                      <p className="pl-4">
                        25% de descuento en implantes dentales
                      </p>
                      <p className="pl-4">
                        No hay nada mejor que una sonrisa saludable para
                        sentirse pleno en esta primavera.
                      </p>
                    </div>

                    <p className="mt-4">
                      ¡Pide cualquiera de estos regalos hasta el martes 15 de
                      octubre!
                    </p>
                    <p className="italic">
                      PS: Tienes que escoger uno de los regalos… no son
                      combinables ni se pueden sumar.
                    </p>
                    <p>
                      Pide tu cita o solicita mayor información al{" "}
                      <span className="font-semibold">72025082</span>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Contact />
    </main>
  );
}
