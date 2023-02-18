import { EditorState } from "draft-js"
import { type NextPage } from "next"
import { useRouter } from "next/router"
import { useState } from "react"
import CustomEditor from "../../components/common/CustomEditor"
import CreatePostForm from "../../components/common/Forms/CreatePostForm"
import SessionStateWrapper from "../../components/common/SessionStateWrapper"
import StateWrapper from "../../components/common/StateWrapper"
import MainLayout from "../../components/layout/MainLayout"
import { api, type RouterOutputs } from "../../utils/api"
import dartJsConversion from "../../utils/dartJsConversion"
import { FaComment } from 'react-icons/fa'
import { MdForum } from 'react-icons/md'
import { USER_ROLE_THINGS } from "../../utils/userRoleThings"
import { formatDateToDisplay } from "../../utils/formatDateToDisplay"
import usePaths from "../../hooks/usePaths"
import LinkButton from "../../components/common/LinkButton"
import clsx from "clsx"
import UserAvatar from "../../components/common/UserAvatar"

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
                                    createdAt={post.createdAt}
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
                                        <UserAvatar
                                            src={sessionData.user.image}
                                            width={50}
                                            height={50}
                                            alt=''
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

    const paths = usePaths()

    return (
        <div className='bg-zinc-900 p-3 rounded flex gap-5 h-full'>
            <div className='w-1/6'>
                <div>
                    <LinkButton
                        className='flex items-center flex-col'
                        href={paths.user(post.user.id)}
                    >
                        <UserAvatar
                            width={50}
                            height={50}
                            alt=''
                            src={post.user.image}
                        />
                        <div className='font-semibold text-lg'>{post.user.name}</div>
                    </LinkButton>
                    <div className={clsx(USER_ROLE_THINGS[post.user.role].textColor, 'text-center')}>{post.user.role}</div>
                </div>
                <div>
                    <div className='flex gap-1 items-center'><MdForum /><span>{post.user._count.threads}</span></div>
                    <div className='flex gap-1 items-center'><FaComment /><span>{post.user._count.posts}</span></div>
                </div>
            </div>
            <div className='w-0.5 bg-zinc-800'></div>
            <div className='flex flex-col space-y-3'>
                <div className='font-semibold text-sm'>{formatDateToDisplay(post.createdAt)}</div>
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