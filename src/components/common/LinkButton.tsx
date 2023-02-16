import clsx from "clsx"
import NextLink, { type LinkProps } from "next/link"

export interface LinkButtonProps extends LinkProps {
    children: React.ReactNode
    className?: string
    underline?: keyof typeof UNDERLINE
    size?: keyof typeof SIZE
}

const LinkButton: React.FC<LinkButtonProps> = ({
    children,
    className,
    underline = 'hover',
    size = 'md',
    ...rest
}) => {
    return (
        <NextLink
            className={clsx(
                className,
                UNDERLINE[underline],
                SIZE[size]
            )}
            {...rest}
        >
            {children}
        </NextLink>
    )
}

export default LinkButton

const UNDERLINE = {
    always: 'underline',
    hover: 'hover:underline'
} as const

const SIZE = {
    sm: '',
    md: 'text-md px-2',
    lg: '',
    xl: ''
} as const