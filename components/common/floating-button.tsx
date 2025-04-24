import React from "react";
export default function FloatingButton() {
  return (
    <a
      href="#"
      className="fixed bottom-[80px] right-[10px] z-[9] h-[45px] w-[45px] cursor-pointer rounded-[5px] bg-orange-400 text-center text-[20px] leading-[45px] text-white transition-all duration-300 ease-out hover:bg-[#00adb5b3] hover:text-white"
    >
      <i className="lni lni-arrow-up"></i>
    </a>
  );
}
