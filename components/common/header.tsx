"use client";
export default function Header() {
  const copiarTelefono = () => {
    const texto = "59172025082";
    navigator.clipboard.writeText(texto);
  };
  const copiarCorreo = () => {
    const texto = "ortiznosiglia@gmail.com";
    navigator.clipboard.writeText(texto);
  };
  return (
    <header id="home">
      <div className="header-wrapper">
        <div className="header-top bg-orange-500">
          <div className="mx-auto w-full px-[calc(1.5rem*0.5)] sm:max-w-[540px] md:max-w-[720px] lg:max-w-[960px] xl:max-w-[1140px] 2xl:max-w-[1320px]">
            <div className="-mx-[calc(1.5rem*0.5)] -mt-[0rem] flex flex-wrap">
              <div className="md:w-2/3">
                <div className="header-top-left text-md-left text-center">
                  <ul className="m-0 mb-0 list-none p-0">
                    <li>
                      <a
                        href="#"
                        className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                        onClick={copiarTelefono}
                      >
                        <i className="lni lni-phone inline-block no-underline"></i>{" "}
                        +591 72025082
                      </a>
                    </li>
                    <li>
                      <a
                        href="#"
                        className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                        onClick={copiarCorreo}
                      >
                        <i className="lni lni-envelope inline-block no-underline"></i>
                        ortiznosiglia@gmail.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="md:w-1/3">
                <div className="header-top-right d-none d-md-block">
                  <ul className="m-0 mb-0 list-none p-0">
                    <li>
                      <a
                        href="https://www.facebook.com/ortiznosiglia"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-facebook-fill inline-block no-underline"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.tiktok.com/@ortiznosiglia"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-tiktok-alt inline-block no-underline"></i>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.instagram.com/ortiznosiglia/"
                        target="_blank"
                        className="inline-block no-underline transition-all duration-300 ease-out hover:text-[#00adb5] focus:shadow-none focus:outline-none"
                      >
                        <i className="lni lni-instagram-original inline-block no-underline"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
