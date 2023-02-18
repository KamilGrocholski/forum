import { EditorState } from "draft-js"
import { type NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import CustomEditor from "../../components/common/CustomEditor"
import CreatePostForm from "../../components/common/Forms/CreatePostForm"
import ImageWithFallback from "../../components/common/ImageWithFallback"
import SessionStateWrapper from "../../components/common/SessionStateWrapper"
import StateWrapper from "../../components/common/StateWrapper"
import MainLayout from "../../components/layout/MainLayout"
import { api, type RouterOutputs } from "../../utils/api"
import dartJsConversion from "../../utils/dartJsConversion"

const ThreadPage: NextPage = () => {
    const router = useRouter()
    const threadId = router.query.threadId as string
    const threadQuery = api.thread.getById.useQuery({ id: threadId })

    return (
        <MainLayout>
            <StateWrapper
                data={threadQuery.data}
                isLoading={threadQuery.isLoading}
                isError={threadQuery.isError}
                NonEmpty={(thread) => (
                    <div className='flex flex-col space-y-5'>
                        <div className='flex flex-col space-y-5'>
                            {thread.posts.map((post) => (
                                <Post
                                    key={post.id}
                                    content={post.content?.toString() ?? ''}
                                    user={post.user}
                                    id={post.id}
                                />
                            ))}
                        </div>
                        <div className='bg-zinc-900 flex gap-3 p-3 rounded'>
                            <SessionStateWrapper
                                Guest={(signIn) => <button onClick={() => void signIn('discord')}>Sign in to post</button>}
                                User={(sessionData) => (
                                    <>
                                        <ImageWithFallback
                                            src={sessionData.user.image ?? ''}
                                            fallbackSrc={''}
                                            alt=''
                                            width={50}
                                            height={50}
                                            className='rounded-full h-fit w-fit'
                                        />
                                        <CreatePostForm threadId={thread.id} />
                                    </>
                                )}
                            />
                        </div>
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default ThreadPage

const Post: React.FC<NonNullable<RouterOutputs['thread']['getById']>['posts'][number]> = (post) => {
    const [mode, setMode] = useState<'view' | 'edit'>('view')

    const [editorState, setEditorState] = useState<EditorState>(dartJsConversion.convertToRead(EditorState.createEmpty(), post.content?.toString() ?? ''))

    return (
        <div className='bg-zinc-900 p-3 rounded flex gap-3 h-full'>
            <div className='w-1/6'>
                <ImageWithFallback
                    src={post.user.image ?? ''}
                    fallbackSrc={''}
                    alt=''
                    width={50}
                    height={50}
                    className='rounded-full w-fit h-fit'
                />
                <div>{post.user.name}</div>
            </div>
            <div className='w-0.5 bg-zinc-800'></div>
            <div>
                {mode === 'view' ?
                    <CustomEditor
                        editorState={editorState}
                        readOnly={true}
                        onChange={() => null}
                    /> : null}
                {mode === 'edit' ?
                    <CustomEditor
                        editorState={editorState}
                        onChange={setEditorState}
                    /> : null}
                <button
                    className='flex justify-start w-fit'
                    onClick={() => setMode(prev => prev === 'edit' ? 'view' : 'edit')}
                >Edit</button>
            </div>
        </div>
    )
}