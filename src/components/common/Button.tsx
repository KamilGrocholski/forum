import clsx from "clsx";
import { forwardRef, type ButtonHTMLAttributes } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  loading?: boolean;
  size?: keyof typeof SIZE;
  variant?: keyof typeof VARIANT;
  className?: string;
  icon?: React.ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    size = "md",
    loading,
    disabled,
    variant = "primary",
    icon,
    className,
    ...rest
  } = props;

  return (
    <button
      type="button"
      className={clsx(
        "w-fit rounded transition-all duration-300 ease-in-out",
        disabled && "opacity-30",
        SIZE[size],
        VARIANT[variant],
        className
      )}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      ref={ref}
      {...rest}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          {" "}
          <AiOutlineLoading3Quarters className="animate-spin" />
          {children}
        </span>
      ) : (
        <span className="flex items-center">
          {icon ? <span className="mr-2">{icon}</span> : null}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
});

Button.displayName = "Button";

export default Button;

const SIZE = {
  sm: "px-1.5 py-0.5 text-sm",
  md: "px-3 py-1 text-md",
  lg: "px-3 py-3 text-lg",
  xl: "px-4 py-3 text-xl",
} as const;

const VARIANT = {
  primary: "bg-red-900 hover:bg-red-800",
  secondary: "bg-zinc-700 hover:bg-zinc-600",
  transparent: false,
} as const;
