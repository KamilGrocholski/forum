import { useForm, type FieldValues, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '../TextInput'
import { subCategorySchemes, type SubCategorySchemes } from '../../../server/api/schemes/subCategory'
import { api } from '../../../utils/api'
import type { Category } from '@prisma/client'

const CreateSubCategoryForm: React.FC<{ categoryId: Category['id'] }> = ({
    categoryId
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SubCategorySchemes['create']>({
        defaultValues: {
            categoryId
        },
        resolver: zodResolver(subCategorySchemes.create)
    })

    const utils = api.useContext()

    const createSubCategory = api.subCategory.create.useMutation({
        onSuccess: (data) => {
            alert(data.name)
        },
        onError: () => {
            alert('error')
        }
    })

    const onValid: SubmitHandler<SubCategorySchemes['create']> = (data, e) => {
        e?.preventDefault()
        console.log(data)
        createSubCategory.mutate(data)
    }

    const onError: SubmitErrorHandler<{
        name: string;
    }> = (data, e) => {
        e?.preventDefault()
        console.log(data)
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onValid, onError)}>

            <TextInput
                id='subCategory-name'
                errorMessage={errors.name?.message}
                {...register('name')}
            />
            <button>Create</button>
        </form>
    )
}

export default CreateSubCategoryForm