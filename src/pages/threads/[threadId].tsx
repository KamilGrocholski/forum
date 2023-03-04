import { EditorState } from "draft-js"
import { type NextPage } from "next"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
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
import Button from "../../components/common/Button"
import { AiFillLike } from 'react-icons/ai'
import { MdReport } from 'react-icons/md'
import { FaQuoteRight, FaReply, FaHashtag } from 'react-icons/fa'
import { HiShare } from 'react-icons/hi'
import Pagination from "../../components/common/Pagination"
import useScrollTo from "../../hooks/useScrollTo"
import { Modal } from "../../components/common/Modal"
import { type SubmitErrorHandler, type SubmitHandler, useForm } from 'react-hook-form'
import TextInput from "../../components/common/TextInput"
import { postSchemes, type PostSchemes } from "../../server/api/schemes/post"
import type { Post as PostPrisma } from "@prisma/client"
import { zodResolver } from "@hookform/resolvers/zod"
import EditPostForm from "../../components/common/Forms/EditPostForm"
import Breadcrumbs from "../../components/common/Breadcrumbs"
import RateThreadForm from "../../components/common/Forms/RateThreadForm"

const limit = 10 as const
const postLikesTake = 3 as const
const calcPostNumber = (currentPage: number, limit: number, index: number) => {
    return index + currentPage * limit
}

const ThreadPage: NextPage = () => {
    const router = useRouter()
    const threadId = router.query.threadId as string
    const pageFromQuery = router.query.page as string
    const parsedPage = pageFromQuery ? parseInt(pageFromQuery) : 0
    const paths = usePaths()
    const scrollToTop = useScrollTo({ top: 0, behavior: 'smooth' })

    const page = useMemo(() => {
        return parsedPage
    }, [parsedPage])

    const threadQuery = api.thread.postsPagination.useQuery(
        {
            limit,
            page,
            threadId,
            postLikesTake
        },
        {
            keepPreviousData: true
        }
    )

    const setPageQuery = (page: number) => {
        void router.replace(
            {
                pathname: router.pathname,
                query: {
                    ...router.query,
                    page
                }
            },
            undefined,
            {
                shallow: true
            }
        )
    }

    return (
        <MainLayout>
            <StateWrapper
                data={threadQuery.data}
                isLoading={threadQuery.isLoading}
                isError={threadQuery.isError}
                NonEmpty={(thread) => (
                    <>
                        <Breadcrumbs items={[
                            <LinkButton
                                href={paths.home()}
                            >
                                {thread.thread.subCategory.category.name}
                            </LinkButton>,
                            <LinkButton
                                href={paths.subCategoryId(thread.thread.subCategory.category.name, thread.thread.subCategory.id)}
                            >
                                {thread.thread.subCategory.name}
                            </LinkButton>,
                            <LinkButton
                                href={paths.thread(thread.thread.id)}
                            >
                                {thread.thread.title}
                            </LinkButton>
                        ]} />
                        <div className='flex flex-col space-y-1 mb-12'>
                            <div className='flex gap-5 items-center flex-wrap'>
                                <div className='font-bold text-4xl'>{thread.thread.title}</div>
                                <RateThreadForm threadId={thread.thread.id} />
                            </div>
                            <div className='text-gray-500 text-sm flex gap-1'>
                                <span>created at</span><span className='text-gray-300'>{formatDateToDisplay(thread.thread.createdAt)}</span>
                            </div>

                            {/* <div className='text-gray-500 text-sm flex gap-1'> */}
                            {/*     <span>updated at</span><span className='text-gray-300'>{formatDateToDisplay(thread.thread.updatedAt)}</span> */}
                            {/* </div> */}
                        </div>
                        <Pagination
                            className='mb-5'
                            currentPage={page}
                            pages={thread.totalPages}
                            goTo={(newPage) => setPageQuery(newPage)}
                            goToNext={() => {
                                setPageQuery(page + 1)
                            }}
                            goToPrev={() => {
                                setPageQuery(page - 1)
                            }}
                            onPageChange={scrollToTop}
                        />
                        <div className='flex flex-col space-y-5'>
                            <div className='flex flex-col space-y-5'>
                                {thread.posts.map((post, index) => (
                                    <Post
                                        key={post.id}
                                        post={{
                                            content: post.content?.toString() ?? '',
                                            createdAt: post.createdAt,
                                            user: post.user,
                                            id: post.id,
                                            _count: post._count,
                                            postLikes: post.postLikes,
                                            thread: post.thread
                                        }}
                                        currentPage={page}
                                        postNumber={calcPostNumber(page, limit, index)}
                                        goToPageWithPostNumberFn={() => paths.threadPageWithPostIndex(page, limit, threadId, calcPostNumber(page, limit, index))}
                                    />
                                ))}
                            </div>
                            <Pagination
                                className='mt-5'
                                currentPage={page}
                                pages={thread.totalPages}
                                goTo={(newPage) => setPageQuery(newPage)}
                                goToNext={() => {
                                    setPageQuery(page + 1)
                                }}
                                goToPrev={() => {
                                    setPageQuery(page - 1)
                                }}
                                onPageChange={scrollToTop}
                            />
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
                                            <CreatePostForm threadId={thread.thread.id} />
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </>
                )}
            />
        </MainLayout>
    )
}

export default ThreadPage

const Post: React.FC<{
    post: NonNullable<RouterOutputs['thread']['postsPagination']>['posts'][number]
    postNumber: number
    currentPage: number
    goToPageWithPostNumberFn: () => string
}> = ({ post, postNumber, goToPageWithPostNumberFn, currentPage }) => {
    const [mode, setMode] = useState<'view' | 'edit'>('view')

    const utils = api.useContext()

    const likePostMutation = api.post.like.useMutation({
        onSuccess: () => {
            alert('polubiono')
            void utils.thread.postsPagination.invalidate({ page: currentPage, limit })
        }
    })

    const handleLikePost = () => {
        likePostMutation.mutate({
            postId: post.id
        })
    }

    const [editorState, setEditorState] = useState<EditorState>(dartJsConversion.convertToRead(EditorState.createEmpty(), post.content?.toString() ?? ''))

    const paths = usePaths()

    const [reportModalOpen, setReportModalOpen] = useState(false)

    return (
        <div
            id={postNumber.toString()}
            className='bg-zinc-900 p-3 rounded flex gap-5 h-full shadow-lg shadow-black scroll-m-28'
        >
            {/* Left side  */}
            <div className='w-1/6 flex flex-col space-y-5'>
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
                        <div className='font-semibold text-lg break-words text-center'>{post.user.name}</div>
                    </LinkButton>
                    <div className={clsx(USER_ROLE_THINGS[post.user.role].textColor, 'text-center')}>{post.user.role}</div>
                </div>
                <div className='text-sm'>
                    <div className='flex gap-1 items-center'><MdForum /><span>{formatDateToDisplay(post.user.createdAt)}</span></div>
                    <div className='flex gap-1 items-center'><MdForum /><span>{post.user._count.threads}</span></div>
                    <div className='flex gap-1 items-center'><FaComment /><span>{post.user._count.posts}</span></div>
                </div>
            </div>

            {/* Veritical line  */}
            <div className='w-0.5 bg-zinc-800'></div>

            {/* Right side */}
            <div className='flex flex-col space-y-3 w-full'>
                <div className='flex justify-between items-center text-sm'>
                    <div className='font-semibold'>{formatDateToDisplay(post.createdAt)}</div>
                    <div className='flex gap-2 items-center'>
                        <div><HiShare /></div>
                        <LinkButton
                            href={goToPageWithPostNumberFn()}
                            className='flex items-center gap-1'
                        >
                            <FaHashtag /><span>{postNumber}</span>
                        </LinkButton>
                    </div>
                </div>

                {/* Post content, edit or view */}
                {mode === 'view' ?
                    <CustomEditor
                        editorState={editorState}
                        readOnly={true}
                        onChange={() => null}
                    /> : null}
                {mode === 'edit' ?
                    <EditPostForm
                        onSuccess={() => {
                            setMode('view')
                            void utils.thread.postsPagination.invalidate({ page: currentPage, threadId: post.thread.id })
                        }}
                        postId={post.id}
                        editorState={editorState}
                        setEditorState={setEditorState}
                    /> : null}
                <SessionStateWrapper
                    Guest={() => <></>}
                    User={(sessionData) => (
                        sessionData.user.id !== post.user.id
                            ? <></>
                            : <div>
                                <Button
                                    onClick={() => setMode(prev => prev === 'edit' ? 'view' : 'edit')}
                                    variant='primary'
                                >
                                    {mode === 'edit' ? 'Stop editing' : 'Edit'}
                                </Button>
                            </div>
                    )}
                />

                {/* Post likes */}
                {post._count.postLikes ?
                    <div className='bg-zinc-800 rounded w-full px-3 py-1 flex items-center text-sm'>
                        {post.postLikes.map((postLike) => (
                            <div key={postLike.user.id} className='flex items-center'>
                                <LinkButton
                                    href={paths.user(postLike.user.id)}
                                    className={USER_ROLE_THINGS[postLike.user.role].textColor}
                                >
                                    {postLike.user.name}
                                </LinkButton>
                            </div>
                        ))}
                        <div>
                            {post._count.postLikes > postLikesTake
                                ? <span>and {post._count.postLikes - postLikesTake} other members liked this post</span>
                                : <span>liked this post</span>}
                        </div>
                    </div>
                    : null}

                {/* Post buttons */}
                <div className='flex justify-between items-end h-full'>
                    <div className='flex gap-3'>
                        <ReportModal openState={[reportModalOpen, setReportModalOpen]} postId={post.id} />
                        <Button
                            onClick={() => setReportModalOpen(true)}
                            className='hover:text-red-900'
                            variant='secondary'
                            size='sm'
                            icon={<MdReport />}
                        >
                            Report
                        </Button>
                    </div>
                    <div className='flex lg:flex-row flex-col gap-3'>
                        <Button
                            onClick={handleLikePost}
                            className='hover:text-red-900'
                            variant='secondary'
                            size='sm'
                            icon={<AiFillLike />}
                        >
                            Like
                        </Button>
                        <Button
                            className='hover:text-red-900'
                            variant='secondary'
                            size='sm'
                            icon={<FaQuoteRight />}
                        >
                            Quote
                        </Button>
                        <Button
                            className='hover:text-red-900'
                            variant='secondary'
                            size='sm'
                            icon={<FaReply />}
                        >
                            Reply
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ReportModal: React.FC<{
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>],
    postId: PostPrisma['id']
}> = ({
    openState,
    postId
}) => {
        const {
            register,
            handleSubmit,
            formState: { errors }
        } = useForm<PostSchemes['report']>({
            defaultValues: {
                postId
            },
            resolver: zodResolver(postSchemes.report)
        })

        const reportPostMutation = api.post.report.useMutation({
            onSuccess: () => {
                alert('reported')
            },
            onError: () => {
                alert('report has not been sent')
            }
        })

        const onValid: SubmitHandler<PostSchemes['report']> = (data, e) => {
            e?.preventDefault()
            openState[1](false)
            reportPostMutation.mutate(data)
        }

        const onError: SubmitErrorHandler<PostSchemes['report']> = (_, e) => {
            e?.preventDefault()
        }

        return (
            <Modal openState={openState}>
                <form
                    className='bg-zinc-800 rounded p-3 flex flex-col space-y-3'
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onSubmit={handleSubmit(onValid, onError)}
                >
                    <Modal.Title className='text-lg font-semibold text-center'>Report this post</Modal.Title>
                    <Modal.Description></Modal.Description>
                    <TextInput
                        label='Reason'
                        id='post-report-reason'
                        {...register('reason')}
                        errorMessage={errors.root?.message}
                    />
                    <Button
                        type='submit'
                    >
                        Send
                    </Button>
                </form>
            </Modal>
        )
    }
