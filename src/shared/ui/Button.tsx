import React from "react";

// Using a type to define strictly what our button can do
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  children,
  className = "",
  ...props
}) => {
  // Base styles (Layout and Transitions)
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

  // Design variants (Interior Design Aesthetic)
  const variants = {
    primary: "bg-black text-white hover:bg-gray-800", // Sleek, modern black
    secondary: "bg-white text-black border border-gray-200 hover:bg-gray-50",
    outline: "border-2 border-white text-white hover:bg-white hover:text-black", // Best for Hero sections
  };

  // Size variations
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-10 py-4 text-lg uppercase tracking-wider", // Hero style
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
