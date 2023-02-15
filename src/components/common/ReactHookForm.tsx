import { type FieldValues } from 'react-hook-form'

interface FormProps<T extends FieldValues> {
    defaultValues: Partial<T>
}

const Form = <T extends FieldValues>({
    defaultValues
}: FormProps<T>) => {
    return (
        <form>

        </form>
    )
}

export default Form