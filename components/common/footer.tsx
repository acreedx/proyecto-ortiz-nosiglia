import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <footer className="footer img-bg h-full pb-[100px] pt-[100px]">
      <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
        <div className="footer-widget-wrapper pb-0">
          <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem]  flex flex-wrap justify-center">
            <div className="mt-[40px] w-full max-w-full flex-shrink-0 px-16 md:w-1/2 lg:w-5/12 xl:w-1/3">
              <div className="footer-widget flex flex-col items-center ">
                <a
                  href={"/"}
                  className="logo inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                >
                  <Image
                    className="max-w-full transform transition-transform duration-300 hover:scale-105"
                    src="/images/logo/logo.png"
                    alt="Logo del centro Ortiz Nosiglia"
                    width={110}
                    height={110}
                  />
                </a>
                <p className="m-0 mb-4 mt-0 text-justify text-[18px] font-normal leading-[28px] text-[#8c96a7]">
                  El centro odontológico Ortiz Nosiglia es un centro dedicado a
                  brindar servicios de odontología a toda la población
                </p>
                <div className="footer-social-links">
                  <ul className="m-0 mb-4 mt-0 list-none p-0 ">
                    <li>
                      <a
                        href="https://www.facebook.com/ortiznosiglia"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out  focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-facebook-fill inline-block no-underline"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/@ortiznosiglia"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-tiktok-alt inline-block no-underline"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/ortiznosiglia/"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-instagram-original inline-block no-underline"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="max-2xsm:mr-2 xsm:mr-2 md:mr-0 md:w-1/2 lg:w-1/4 xl:w-1/6">
              <div className="footer-widget">
                <h4 className="m-0 font-raleway text-[25px] font-semibold text-[#393e46]">
                  Links
                </h4>
                <ul className="footer-links m-0 mb-4 mt-0 list-none p-0 ">
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400  focus:shadow-none focus:outline-none"
                      href="#"
                    >
                      Inicio
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400  focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Servicios
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#"
                    >
                      Contacto
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-5/12 lg:w-1/4 xl:w-1/6">
              <div className="footer-widget mb-30">
                <h4 className="m-0 font-raleway text-[25px] font-semibold text-[#393e46]">
                  Servicios
                </h4>
                <ul className="footer-links m-0 mb-4 mt-0 list-none p-0">
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Implantes Dentales
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Carillas - Coronas
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Ortodoncia Tradicional
                    </a>
                  </li>
                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Ortodoncia Invisible
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Odontopediatría
                    </a>
                  </li>

                  <li>
                    <a
                      className="inline-block text-white no-underline transition-all duration-300 ease-out hover:text-orange-400 focus:shadow-none focus:outline-none"
                      href="#services"
                    >
                      Tratamiento Anti Ronquidos
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:w-7/12 lg:w-full xl:w-1/3">
              <div className="footer-widget">
                <h4 className="m-0 text-center font-raleway text-[25px] font-semibold text-[#393e46] xsm:w-full xsm:p-1 sm:w-full sm:p-1">
                  {" "}
                  Ubicación del centro
                </h4>
                <div className="map-canvas">
                  <iframe
                    className="map"
                    id="gmap_canvas"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3824.6860226115905!2d-68.08588148831532!3d-16.541941341742554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f219a0459807d%3A0xc6f594b962363dc0!2sConsultorio%20Dental%20Ortiz%20Nosiglia!5e0!3m2!1ses-419!2sbo!4v1726956035506!5m2!1ses-419!2sbo"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
