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
import { USER_ROLE_THINGS } from "../../utils/userRoleThings"
import UserAvatar from "../common/UserAvatar"
import SessionStateWrapper from "../common/SessionStateWrapper"

const Footer: React.FC = () => {
    const layoutWidth = appStore(state => state.layoutWidth)
    const paths = usePaths()
    const threadsCount = api.thread.count.useQuery()
    const postsCount = api.post.count.useQuery()
    const usersCount = api.user.count.useQuery()
    const lastNewUser = api.user.getLastNewUser.useQuery()

    return (
        <footer className='border-t-4 border-red-900 bg-zinc-900 pt-3'>
            <div className={`flex flex-col space-y-3 px-3 ${layoutWidth === 'container' ? 'container mx-auto' : 'w-full'}`}>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3'>
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
                            <span>User navigation</span>
                        </h2>
                        <div>
                            <SessionStateWrapper
                                Guest={(signIn) => (
                                  <div>
                                    <button onClick={() => signIn('discord')}>Sign in</button>
                                  </div>
                                )}
                                User={(sessionData) => (
                                  <div className='flex flex-col'>
                                    <LinkButton
                                      href={paths.user(sessionData.user.id)}
                                    >
                                      Profile
                                    </LinkButton>
                                  </div>
                                )}
                            />
                         </div>
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
                            <div className='flex justify-between items-center'>
                                <span className='whitespace-nowrap mr-2'>New member:</span>
                                <StateWrapper
                                    data={lastNewUser.data}
                                    isLoading={lastNewUser.isLoading}
                                    isError={lastNewUser.isError}
                                    NonEmpty={(user) =>
                                        <LinkButton className='flex gap-1 items-center' href={paths.user(user.id)}>
                                            <UserAvatar
                                                width={10}
                                                height={10}
                                                alt=''
                                                src={user.image}
                                            />
                                            <span className={`truncate block ${USER_ROLE_THINGS[user.role].textColor}`}>{user.name}</span>
                                        </LinkButton>
                                    }
                                    Loading={<SmallLoader />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='bg-zinc-800 mt-3 h-8  px-3 text-center'>Copy right</div>
        </footer>
    )
}

export default Footer
