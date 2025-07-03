"use client";
import React, { useState } from "react";
interface DropDownCardProps {
  title: string;
  content: string;
}
export default function DropDownCard({ title, content }: DropDownCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleContent = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="faq-item mb-[20px] bg-orange-500 shadow-lg">
      <div>
        <h5 className="font-raleway m-0 mb-0 text-[20px] font-semibold text-[#393e46]">
          <button
            className="faq-btn hover:text-hover-color hover:bg-hover-bg hover:border-hover-border-color 
            disabled:bg-disabled-bg disabled:border-disabled-border-color inline-block rounded-md border 
            border-transparent bg-transparent px-1.5 py-1.5 text-base font-normal leading-6 text-current 
            shadow-md transition-colors focus:no-underline  focus:outline-none  disabled:pointer-events-none disabled:opacity-65 cursor-pointer"
            type="button"
            onClick={toggleContent}
          >
            {title}
            {!isOpen ? (
              <i className="lni lni-circle-plus inline-block no-underline"></i>
            ) : (
              <i className="lni lni-circle-minus inline-block no-underline"></i>
            )}
          </button>
        </h5>
      </div>
      {isOpen && (
        <div className="show">
          <div className="faq-content">{content}</div>
        </div>
      )}
    </div>
  );
}
