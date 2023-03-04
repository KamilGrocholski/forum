import { forwardRef } from "react"
import clsx from "clsx"

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    errorMessage?: string
    id: string,
    sizeInput?: keyof typeof SIZE
}

const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
    const {
        label,
        id,
        errorMessage,
        sizeInput = 'md',
        ...rest
    } = props

    return (
        <label
            htmlFor={id}
        >
            {label ?
                <p>{label}</p> : null}
            {errorMessage ?
                <p>{errorMessage}</p> : null}
            <input
                type='text'
                className={clsx(
                    SIZE[sizeInput]
                )}
                id={id}
                ref={ref}
                {...rest}
            />
        </label>
    )
})

TextInput.displayName = 'TextInput'

export default TextInput

const SIZE = {
    sm: 'px-1 text-sm',
    md: 'px-2 py-1 text-md',
    lg: 'px-3 py-2 text-lg',
} as const
