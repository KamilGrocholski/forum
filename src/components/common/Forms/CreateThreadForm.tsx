import { useForm, type SubmitHandler, type SubmitErrorHandler, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TextInput from '../TextInput'
import { threadSchemes, type ThreadSchemes } from '../../../server/api/schemes/thread'
import { api } from '../../../utils/api'
import { useRouter } from 'next/router'
import StateWrapper from '../StateWrapper'
import { Modal } from '../Modal'
import { useState } from 'react'
import usePaths from '../../../hooks/usePaths'
import CustomEditor from '../CustomEditor'
import { type ContentState, convertToRaw, EditorState, type RawDraftContentState, convertFromRaw } from 'draft-js'
import { z } from 'zod'
import dartJsConversion from '../../../utils/dartJsConversion'
import Button from '../Button'

const CreateThreadForm: React.FC = () => {
    const [subCategoryName, setSubCategoryName] = useState<string | null>(null)

    const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())

    const {
        control,
        register,
        setValue,
        handleSubmit,
        formState: { errors }
    } = useForm<Omit<ThreadSchemes['create'], 'content'>>({
        resolver: zodResolver(z.object({
            title: z.string(),
            subCategoryId: z.string()
        }))
    })

    const paths = usePaths()
    const utils = api.useContext()
    const router = useRouter()
    const [open, setOpen] = useState(false)

    const createThread = api.thread.create.useMutation({
        onSuccess: (data) => {
            alert(data.title)
            void router.push(paths.thread(data.id))
        },
        onError: () => {
            alert('error')
        }
    })

    const onValid: SubmitHandler<Omit<ThreadSchemes['create'], 'content'>> = (data, e) => {
        e?.preventDefault()

        const content = dartJsConversion.convertToSaveInDatabase(editorState)
        createThread.mutate({
            ...data,
            content
        })
    }

    const onError: SubmitErrorHandler<Omit<ThreadSchemes['create'], 'content'>> = (data, e) => {
        e?.preventDefault()
    }

    return (
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        <form onSubmit={handleSubmit(onValid, onError)} className='bg-zinc-700 p-3 rounded flex flex-col space-y-3'>
            <button type='button' onClick={() => setOpen(true)}>Open</button>
            <Modal openState={[open, setOpen]}>
                <CategoryWithSubCategories
                    onSelect={(id, name) => {
                        setValue('subCategoryId', id)
                        setSubCategoryName(name)
                        setOpen(false)
                    }}
                />
            </Modal>
            <TextInput
                id='thread-title'
                placeholder='Thread title'
                errorMessage={errors.title?.message}
                {...register('title')}
            />

            <CustomEditor editorState={editorState} onChange={setEditorState} />

            <div>{subCategoryName}</div>
            <TextInput
                disabled={true}
                className='hidden'
                id='thread-subCategoryId'
                errorMessage={errors.subCategoryId?.message}
                {...register('subCategoryId')}
            />
            <Button
                type='submit'
                loading={createThread.isLoading || createThread.isSuccess}
            >
                Create
            </Button>
        </form>
    )
}

export default CreateThreadForm

const CategoryWithSubCategories: React.FC<{
    onSelect: (id: string, name: string) => void
}> = ({ onSelect }) => {
    const listQuery = api.category.getAllWithSubCategoriesSmallInfo.useQuery()

    return (
        <StateWrapper
            data={listQuery.data}
            isLoading={listQuery.isLoading}
            isError={listQuery.isError}
            NonEmpty={(list) => (
                <div className='flex flex-col bg-zinc-900 p-3'>
                    {list.map((category) => (
                        <div key={category.id}>
                            <div className='bg-red-900 px-3'>{category.name}</div>
                            <div className='flex flex-col'>
                                {category.subCategories.map((subCategory) => (
                                    <button
                                        key={subCategory.id}
                                        onClick={() => onSelect(subCategory.id, subCategory.name)}
                                        className='text-start px-3 flex flex-row justify-between min-w-[500px] hover:bg-zinc-800'
                                    >
                                        <span>{subCategory.name}</span>
                                        <span>Threads: {subCategory._count.threads}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        />
    )
}