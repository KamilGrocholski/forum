import clsx from "clsx";
import NextLink, { type LinkProps } from "next/link";
import { forwardRef } from "react";

export interface LinkButtonProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
  underline?: keyof typeof UNDERLINE;
  size?: keyof typeof SIZE;
}

const LinkButton = forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ children, className, underline = "hover", size = "md", ...rest }, ref) => {
    return (
      <NextLink
        className={clsx(className, UNDERLINE[underline], SIZE[size])}
        ref={ref}
        {...rest}
      >
        {children}
      </NextLink>
    );
  }
);

LinkButton.displayName = "LinkButton";

export default LinkButton;

const UNDERLINE = {
  always: "underline",
  hover: "hover:underline",
} as const;

const SIZE = {
  sm: "",
  md: "text-md px-2",
  lg: "",
  xl: "",
} as const;
