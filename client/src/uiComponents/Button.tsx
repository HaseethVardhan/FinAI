import React from "react";

interface ButtonProps {
  text: string; // Button text
  onClick?: () => void; // Optional click handler
  type?: "button" | "submit" | "reset"; // Default: button
  bgColor?: string;
  hoverColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  type = "button",
  bgColor = "bg-primary",
  hoverColor = "bg-primary-dark",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full ${bgColor} text-white py-3 px-6 rounded-full font-semibold 
                 hover:${hoverColor} transition-colors`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {text}
    </button>
  );
};

export default Button;
