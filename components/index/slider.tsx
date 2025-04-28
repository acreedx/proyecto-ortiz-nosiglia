"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
export default function Slider() {
  return (
    <section className="slider-section">
      <Swiper
        className="h-[772px]"
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        navigation
        pagination={{
          clickable: true,
        }}
      >
        <SwiperSlide>
          <div className="single-slider img-bg bg-orange-400">
            <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
              <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
                <div className="md:w-10/12 lg:w-2/3 xl:w-7/12">
                  <div className="slider-content h-[772px]">
                    <h1
                      className="font-raleway m-0 mb-2 mt-0 text-[calc(1.375rem+1.5vw)] font-medium leading-tight text-[#393e46] text-[color:var(--bs-heading-color)] xl:text-[2.5rem]"
                      data-animation="fadeInDown"
                      data-duration="1.5s"
                      data-delay=".5s"
                    >
                      Cuida tu salud dental
                    </h1>
                    <p
                      data-animation="fadeInLeft"
                      data-duration="1.5s"
                      data-delay=".7s"
                    >
                      El centro odontológico Ortiz Nosilgia es un centro
                      dedicado a brindar servicios de odontología general a toda
                      la población
                    </p>
                    <a
                      href="#about"
                      className="inline-block rounded-md border border-transparent bg-slate-50  px-3 py-1.5 text-base  font-normal leading-6 text-current text-orange-500 no-underline shadow-md transition-colors duration-300 ease-out hover:text-orange-700 focus:shadow-none focus:outline-none disabled:pointer-events-none disabled:opacity-65"
                      data-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay=".9s"
                    >
                      Aprender más
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="single-slider img-bg bg-orange-400">
            <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
              <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
                <div className="md:w-10/12 lg:w-2/3 xl:w-7/12">
                  <div className="slider-content h-[772px]">
                    <h1
                      className="font-raleway m-0 mb-2 mt-0 text-[calc(1.375rem+1.5vw)] font-medium leading-tight text-[#393e46] text-[color:var(--bs-heading-color)] xl:text-[2.5rem]"
                      data-animation="fadeInDown"
                      data-duration="1.5s"
                      data-delay=".5s"
                    >
                      Los mejores dentistas de la ciudad
                    </h1>
                    <p
                      data-animation="fadeInLeft"
                      data-duration="1.5s"
                      data-delay=".7s"
                    >
                      El centro odontológico Ortiz Nosilgia es un centro
                      dedicado a brindar servicios de odontología general a toda
                      la población
                    </p>
                    <a
                      href="#contact"
                      className="inline-block rounded-md border border-transparent bg-slate-50  px-3 py-1.5 text-base  font-normal leading-6 text-current text-orange-500 no-underline shadow-md transition-colors duration-300 ease-out hover:text-orange-700 focus:shadow-none focus:outline-none disabled:pointer-events-none disabled:opacity-65"
                      data-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay=".9s"
                    >
                      Aprender más
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="single-slider img-bg bg-orange-400">
            <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
              <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
                <div className="md:w-10/12 lg:w-2/3 xl:w-7/12">
                  <div className="slider-content h-[772px]">
                    <h1
                      className="font-raleway m-0 mb-2 mt-0 text-[calc(1.375rem+1.5vw)] font-medium leading-tight text-[#393e46] text-[color:var(--bs-heading-color)] xl:text-[2.5rem]"
                      data-animation="fadeInDown"
                      data-duration="1.5s"
                      data-delay=".5s"
                    >
                      Tu salud es nuestra prioridad
                    </h1>
                    <p
                      data-animation="fadeInLeft"
                      data-duration="1.5s"
                      data-delay=".7s"
                    >
                      El centro odontológico Ortiz Nosilgia es un centro
                      dedicado a brindar servicios de odontología general a toda
                      la población
                    </p>
                    <a
                      href="#services"
                      className="inline-block rounded-md border border-transparent bg-slate-50  px-3 py-1.5 text-base  font-normal  leading-6 text-current text-orange-500 no-underline shadow-md transition-colors duration-300 ease-out hover:text-orange-700 focus:shadow-none focus:outline-none disabled:pointer-events-none disabled:opacity-65"
                      data-animation="fadeInUp"
                      data-duration="1.5s"
                      data-delay=".9s"
                    >
                      Aprender más
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
}
