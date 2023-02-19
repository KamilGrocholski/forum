import clsx from "clsx"
import { forwardRef, type ButtonHTMLAttributes } from "react"
import { AiOutlineLoading3Quarters } from 'react-icons/ai'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode
    loading?: boolean
    size?: keyof typeof SIZE
    variant?: keyof typeof VARIANT
    className?: string
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const {
        children,
        size = 'md',
        loading,
        disabled,
        variant = 'primary',
        className,
        ...rest
    } = props

    return (
        <button
            type='button'
            className={clsx(
                'rounded w-fit transition-all duration-300 ease-in-out',
                disabled && 'opacity-30',
                SIZE[size],
                VARIANT[variant],
                className
            )}
            disabled={disabled || loading}
            aria-disabled={disabled || loading}
            ref={ref}
            {...rest}
        >
            {loading
                ? <span className='flex gap-2 items-center'> <AiOutlineLoading3Quarters className='animate-spin' />{children}</span>
                : children}
        </button>
    )
})

Button.displayName = 'Button'

export default Button

const SIZE = {
    sm: '',
    md: 'px-3 py-1 text-md',
    lg: '',
    xl: ''
} as const

const VARIANT = {
    primary: 'bg-red-900 hover:bg-red-800',
    secondary: 'bg-zinc-500 hover:bg-zinc-400'
} as const