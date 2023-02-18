import { useForm, type SubmitHandler, type SubmitErrorHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api } from '../../../utils/api'
import { useRouter } from 'next/router'
import { useState } from 'react'
import usePaths from '../../../hooks/usePaths'
import CustomEditor from '../CustomEditor'
import { EditorState } from 'draft-js'
import dartJsConversion from '../../../utils/dartJsConversion'
import { type PostSchemes, postSchemes } from '../../../server/api/schemes/post'
import type { Thread } from '@prisma/client'
import { z } from 'zod'

const CreatePostForm: React.FC<{
    threadId: Thread['id']
}> = ({
    threadId
}) => {
        const [editorState, setEditorState] = useState<EditorState>(() => EditorState.createEmpty())

        const {
            control,
            register,
            setValue,
            handleSubmit,
            formState: { errors }
        } = useForm<Omit<PostSchemes['create'], 'content'>>({
            defaultValues: {
                threadId
            },
            resolver: zodResolver(z.object({
                threadId: z.string().cuid()
            }))
        })

        const paths = usePaths()
        const utils = api.useContext()

        const createPost = api.post.create.useMutation({
            onSuccess: (data) => {
                void utils.thread.getById.invalidate({ id: threadId })
            },
            onError: () => {
                alert('error')
            }
        })

        const onValid: SubmitHandler<Omit<PostSchemes['create'], 'content'>> = (data, e) => {
            e?.preventDefault()
            console.log(data)
            const content = dartJsConversion.convertToSaveInDatabase(editorState)
            createPost.mutate({
                threadId: data.threadId,
                content
            })
        }

        const onError: SubmitErrorHandler<Omit<PostSchemes['create'], 'content'>> = (data, e) => {
            e?.preventDefault()
            console.log({
                ...data,
                editorState: dartJsConversion.convertToSaveInDatabase(editorState)
            })
        }

        return (
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            <form onSubmit={handleSubmit(onValid, onError)} className='p-3 rounded flex flex-col space-y-3'>
                <CustomEditor editorState={editorState} onChange={setEditorState} />

                <button className='w-fit bg-red-900 px-3 py-1 rounded'>Create</button>
            </form>
        )
    }

export default CreatePostForm