import { appStore } from "../../store/appStore"
import { FcAbout } from 'react-icons/fc'
import { RiNavigationFill } from 'react-icons/ri'
import { FaUserAlt } from 'react-icons/fa'
import { ImStatsBars } from 'react-icons/im'
import usePaths from "../../hooks/usePaths"
import LinkButton from "../common/LinkButton"
import { api } from "../../utils/api"
import StateWrapper from "../common/StateWrapper"
import SmallLoader from "../common/SmallLoader"

const Footer: React.FC = () => {
    const layoutWidth = appStore(state => state.layoutWidth)
    const paths = usePaths()
    const threadsCount = api.thread.count.useQuery()
    const postsCount = api.post.count.useQuery()
    const usersCount = api.user.count.useQuery()

    return (
        <footer className='border-t-4 border-red-900 bg-zinc-900 pt-3'>
            <div className={`flex flex-col space-y-3 px-3 ${layoutWidth === 'container' ? 'container mx-auto' : 'w-full'}`}>
                <div className='grid grid-cols-4 gap-3'>
                    <div>
                        <h2 className='text-red-900 text-lg font-semibold flex items-center gap-2'>
                            <FcAbout />
                            <span>About us</span>
                        </h2>
                        <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, sapiente ipsum veritatis accusamus aspernatur, nemo perspiciatis facilis cum nisi repellat dolor quisquam in vero natus, aliquid asperiores. Officiis, architecto rerum!</div>
                    </div>
                    <div>
                        <h2 className='text-red-900 text-lg font-semibold flex items-center gap-2'>
                            <RiNavigationFill />
                            <span>Navigation</span>
                        </h2>
                        <div className='flex flex-col'>
                            <LinkButton href={paths.home()}>Home</LinkButton>
                            <LinkButton href={paths.postThread()}>Post thread</LinkButton>
                        </div>
                    </div>
                    <div>
                        <h2 className='text-red-900 text-lg font-semibold flex items-center gap-2'>
                            <FaUserAlt />
                            <span>User info</span>
                        </h2>
                        <div>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet, sapiente ipsum veritatis accusamus aspernatur, nemo perspiciatis facilis cum nisi repellat dolor quisquam in vero natus, aliquid asperiores. Officiis, architecto rerum!</div>
                    </div>
                    <div>
                        <h2 className='text-red-900 text-lg font-semibold flex items-center gap-2'>
                            <ImStatsBars />
                            <span>Forum statistics</span>
                        </h2>
                        <div>
                            <div className='flex justify-between items-center'>
                                <span>Threads:</span>
                                <StateWrapper
                                    data={threadsCount.data}
                                    isLoading={threadsCount.isLoading}
                                    isError={threadsCount.isError}
                                    NonEmpty={(count) => <span>{count}</span>}
                                    Loading={<SmallLoader />}
                                />
                            </div>
                            <div className='flex justify-between items-center'>
                                <span>Posts:</span>
                                <StateWrapper
                                    data={postsCount.data}
                                    isLoading={postsCount.isLoading}
                                    isError={postsCount.isError}
                                    NonEmpty={(count) => <span>{count}</span>}
                                    Loading={<SmallLoader />}
                                />
                            </div>
                            <div className='flex justify-between items-center'>
                                <span>Members:</span>
                                <StateWrapper
                                    data={usersCount.data}
                                    isLoading={usersCount.isLoading}
                                    isError={usersCount.isError}
                                    NonEmpty={(count) => <span>{count}</span>}
                                    Loading={<SmallLoader />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div>STRONA</div>
            </div>
            <div className='bg-zinc-600 mt-3 h-10'>Copy right</div>
        </footer>
    )
}

export default Footer