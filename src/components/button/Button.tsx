import React, { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  accentColor: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: React.FC<ButtonProps> = ({
  accentColor,
  children,
  className,
  disabled,
  ...allProps
}) => {
  return (
    <button
      className={`flex flex-row ${
        disabled ? "pointer-events-none opacity-50" : ""
      } text-white font-medium text-sm justify-center items-center border border-transparent bg-${accentColor}-600 px-4 py-2 rounded-full transition-all ease-out duration-300 hover:bg-${accentColor}-500 hover:shadow-lg hover:shadow-${accentColor}-500/20 active:scale-95 ${className}`}
      {...allProps}
    >
      {children}
    </button>
  );
};
