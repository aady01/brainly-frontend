import { ReactElement, useState } from "react";

interface ButtonProps {
  variant: "primary" | "secondary";
  text: string;
  startIcon?: ReactElement;
  onClick?: () => void;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
}

const variantClasses = {
  primary:
    "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:from-purple-700 hover:to-purple-800 shadow-md focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50",
  secondary:
    "bg-purple-100 text-purple-700 border border-purple-300 hover:bg-purple-200 hover:border-purple-400 focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50",
};

const defaultStyles =
  "px-4 py-2 rounded-md font-medium flex items-center gap-2 transition-all duration-200 ease-in-out focus:outline-none";

export function Button({
  variant,
  text,
  startIcon,
  onClick,
  fullWidth,
  loading,
  className,
  disabled,
  ariaLabel,
  type = "button",
}: ButtonProps) {
  const [isPressed, setIsPressed] = useState(false);
  const isDisabled = disabled || loading;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick && !isDisabled) {
      onClick();
    }
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      aria-label={ariaLabel || text}
      aria-busy={loading}
      aria-disabled={isDisabled}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => isPressed && setIsPressed(false)}
      className={
        className ||
        `${variantClasses[variant]} ${defaultStyles} ${
          fullWidth ? "w-full flex justify-center items-center" : ""
        } ${
          isDisabled
            ? "opacity-60 cursor-not-allowed"
            : "transform hover:-translate-y-0.5 active:translate-y-0"
        } ${isPressed ? "scale-95" : ""}`
      }
    >
      {loading ? (
        <span
          className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin mr-2"
          aria-hidden="true"
        ></span>
      ) : (
        startIcon && (
          <span className="mr-1" aria-hidden="true">
            {startIcon}
          </span>
        )
      )}
      <span>{text}</span>
    </button>
  );
}
