import clsx from "clsx";
import { type HTMLAttributes, forwardRef } from "react";

interface IndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  x: keyof typeof POSITION_X;
  y: keyof typeof POSITION_Y;
  children: React.ReactNode;
  content: React.ReactNode;
  showIndicator?: boolean;
  size?: keyof typeof SIZE;
  shape?: keyof typeof SHAPE;
  variant?: keyof typeof VARIANT;
}

const Indicator = forwardRef<HTMLDivElement, IndicatorProps>((props, ref) => {
  const {
    x,
    y,
    children,
    content,
    showIndicator = true,
    size = "md",
    shape = "circle",
    variant = "primary",
    ...rest
  } = props;

  return (
    <div>
      <div className="relative">
        <span
          className={clsx(
            POSITION_X[x],
            POSITION_Y[y],
            SIZE[size],
            SHAPE[shape],
            VARIANT[variant],
            !showIndicator && "hidden",
            "items absolute flex items-center justify-center"
          )}
          {...rest}
          ref={ref}
        >
          {content}
        </span>
        <span>{children}</span>
      </div>
    </div>
  );
});

Indicator.displayName = "Indicator";

const POSITION_X = {
  start: "-left-2",
  center: "mx-auto",
  end: "-right-2",
} as const;

const POSITION_Y = {
  top: "-top-2",
  mid: "my-auto",
  bottom: "-bottom-2",
} as const;

const SHAPE = {
  circle: "rounded-full",
  square: undefined,
  oval: "rounded",
} as const;

const SIZE = {
  sm: "h-3 w-3 text-xs",
  md: "h-4 w-4 text-xs",
  lg: "h-5 w-5 text-xs",
} as const;

const VARIANT = {
  primary: "bg-red-900",
  secondary: "bg-zinc-300",
} as const;

export default Indicator;
