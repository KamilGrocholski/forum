import { useForm, type FieldValues, type SubmitHandler, type SubmitErrorHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '../TextInput'
import { threadSchemes, type ThreadSchemes } from '../../../server/api/schemes/thread'
import { api } from '../../../utils/api'
import type { SubCategory } from '@prisma/client'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import StateWrapper from '../StateWrapper'
import { Modal } from '../Modal'
import { useState } from 'react'
const PostContentInput = dynamic(import("../PostContentInput"), {
    ssr: false,
    loading: () => <p>Loading...</p>
})

const CreateThreadForm: React.FC = () => {
    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm<ThreadSchemes['create']>({
        resolver: zodResolver(threadSchemes.create)
    })

    const utils = api.useContext()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const createThread = api.thread.create.useMutation({
        onSuccess: (data) => {
            alert(data.title)
            void router.push(`/threads/${data.id}`)
        },
        onError: () => {
            alert('error')
        }
    })

    const onValid: SubmitHandler<ThreadSchemes['create']> = (data, e) => {
        e?.preventDefault()
        console.log(data)
        createThread.mutate(data)
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
            <button onClick={() => setOpen(true)}>Open</button>
            <Modal openState={[open, setOpen]}>
                <CategoryWithSubCategories
                    onSelect={(id) => setValue('subCategoryId', id)}
                />
            </Modal>
            <TextInput
                id='thread-title'
                errorMessage={errors.title?.message}
                {...register('title')}
            />
            <TextInput
                id='thread-content'
                errorMessage={errors.content?.message}
                {...register('content')}
            />
            <TextInput
                disabled={true}
                id='thread-subCategoryId'
                errorMessage={errors.subCategoryId?.message}
                {...register('subCategoryId')}
            />
            <button>Create</button>
        </form>
    )
}

export default CreateThreadForm

const CategoryWithSubCategories: React.FC<{
    onSelect: (id: string) => void
}> = ({ onSelect }) => {
    const listQuery = api.category.getAllWithSubCategoriesSmallInfo.useQuery()

    return (
        <StateWrapper
            data={listQuery.data}
            isLoading={listQuery.isLoading}
            isError={listQuery.isError}
            NonEmpty={(list) => (
                <div>
                    {list.map((category) => (
                        <div key={category.id}>
                            <div>{category.name}</div>
                            <div>
                                {category.subCategories.map((subCategory) => (
                                    <button key={subCategory.id} onClick={() => onSelect(subCategory.id)}>{subCategory.name}</button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        />
    )
}