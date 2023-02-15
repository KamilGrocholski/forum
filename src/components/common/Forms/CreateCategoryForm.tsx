import { useForm, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '../TextInput'
import { categorySchemes, type CategorySchemes } from '../../../server/api/schemes/category'
import { api } from '../../../utils/api'

const CreateCategoryForm: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<CategorySchemes['create']>({
        resolver: zodResolver(categorySchemes.create)
    })

    const utils = api.useContext()

    const createCategory = api.category.create.useMutation({
        onSuccess: (data) => {
            alert(data.name)
        },
        onError: () => {
            alert('error')
        }
    })

    const onValid: SubmitHandler<CategorySchemes['create']> = (data, e) => {
        e?.preventDefault()
        console.log(data)
        createCategory.mutate(data)
    }

    const onError: SubmitErrorHandler<CategorySchemes['create']> = (data, e) => {
        e?.preventDefault()
        console.log(data)
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onValid, onError)}>

            <TextInput
                id='category-name'
                errorMessage={errors.name?.message}
                {...register('name')}
            />
            <button>Create</button>
        </form>
    )
}

export default CreateCategoryForm