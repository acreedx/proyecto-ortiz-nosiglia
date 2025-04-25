import Image from "next/image";
import React from "react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="team-section relative bg-white pb-[150px] pt-[150px]"
    >
      <div className="shape left-4 top-16">
        <Image
          className="max-w-full"
          src="/images/paginaweb/shapes/shape-2.svg"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="shape right-4 top-8">
        <Image
          className="max-w-full"
          src="/images/paginaweb/shapes/shape-5.svg"
          alt=""
          width={400}
          height={400}
        />
      </div>
      <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
        <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
          <div className="mx-auto mt-[0rem] w-full max-w-full flex-shrink-0 px-[calc(1.5rem*0.5)] xl:w-2/3">
            <div className="section-title mb-[55px] text-center">
              <span
                className="wow fadeInDown mb-[15px] inline-block font-raleway text-[25px] font-semibold text-orange-400 no-underline"
                data-wow-delay=".2s"
              >
                Reservas
              </span>
              <h2
                className="wow fadeInUp m-0  mb-2 mt-0 font-raleway text-[calc(1.325rem+0.9vw)] font-medium leading-[1.2] text-[#393e46] md:text-[2rem]"
                data-wow-delay=".4s"
              >
                Has una reserva ahora!
              </h2>
              <p
                className="wow fadeInUp m-0 text-[18px] font-normal leading-[28px] text-[#8c96a7]"
                data-wow-delay=".6s"
              >
                Puedes registrarte en línea y hacer una reserva en menos de 1
                minuto
                <br />
              </p>
              <br />
              <a
                href={"TODO"}
                rel="nofollow"
                className="inline-block rounded-md border border-transparent bg-transparent  px-3 py-1.5  text-base font-normal leading-6 text-current text-orange-500 no-underline shadow-md transition-colors duration-300 ease-out hover:text-orange-700 focus:shadow-none  focus:outline-none disabled:pointer-events-none disabled:opacity-65"
              >
                Reserva tu cita ahora!
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
