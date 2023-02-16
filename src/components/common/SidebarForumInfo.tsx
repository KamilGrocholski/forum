import { FaComment } from "react-icons/fa"
import { api } from "../../utils/api"
import { formatDateToDisplay } from "../../utils/formatDateToDisplay"
import Dot from "./Dot"
import Image from 'next/image'
import StateWrapper from "./StateWrapper"
import usePaths from "../../hooks/usePaths"
import LinkButton from "./LinkButton"

const SidebarForumInfo: React.FC = () => {
    const paths = usePaths()
    const latestThreads = api.thread.getLatest.useQuery()
    // const latestPosts = api.post.getLatest.useQuery()

    return (
        <div className='w-[250px]'>
            <h1 className='flex gap-3 items-center px-3 text-lg font-semibold'>
                <FaComment />
                <span>Latest posts</span>
            </h1>
            <div className='bg-zinc-900 p-2 rounded-sm'>
                <StateWrapper
                    data={latestThreads.data}
                    isLoading={latestThreads.isLoading}
                    isError={latestThreads.isError}
                    NonEmpty={(latestThreads) => (
                        <>
                            {
                                latestThreads.map(thread => (
                                    <div key={thread.id} className='flex gap-3 items-center'>
                                        <div className='min-w-fit'>
                                            <Image
                                                src={thread.user.image ?? ''}
                                                alt=''
                                                height={30}
                                                width={30}
                                            />
                                        </div>
                                        <div className='min-w-0'>
                                            <LinkButton
                                                href={paths.thread(thread.id)}
                                                className='hover:underline text-red-900 font-semibold truncate block'
                                            >
                                                {thread.title}
                                            </LinkButton>
                                            <div className='flex gap-2 items-center text-xs'>
                                                <LinkButton href={paths.subCategoryId(thread.subCategory.category.name, thread.subCategory.id)} className='underline'>{thread.subCategory.name}</LinkButton>
                                                <Dot />
                                                <span>{formatDateToDisplay(thread.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            }
                        </>
                    )}
                />
            </div>
        </div>
    )
}

export default SidebarForumInfo