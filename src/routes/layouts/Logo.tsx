import React from "react";
import { FiAperture } from "react-icons/fi";
import { twMerge } from "tailwind-merge";

export const Logo: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <strong
      className={twMerge(
        `flex gap-2 items-center text-xl text-white cursor-pointer ${
          className ?? ""
        }`
      )}
      {...props}
    >
      <FiAperture size={25} /> Gestão universitária UCS
    </strong>
  );
};
