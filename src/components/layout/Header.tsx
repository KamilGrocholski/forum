import Link from "next/link"
import { Fragment, useState } from "react"
import { appStore } from "../../store/appStore"
import SessionStateWrapper from "../common/SessionStateWrapper"
import { AiOutlineColumnWidth } from 'react-icons/ai'
import { BiBell } from "react-icons/bi"
import { FiMail, FiSearch } from "react-icons/fi"
import { Menu, Transition } from "@headlessui/react"
import type { Role } from "@prisma/client"
import usePaths from "../../hooks/usePaths"
import UserAvatar from "../common/UserAvatar"
import { USER_ROLE_THINGS } from "../../utils/userRoleThings"
import { Modal } from "../common/Modal"
import LiveSearch from "../common/LiveSearch"
import LinkButton from "../common/LinkButton"

const Header = () => {
    const paths = usePaths()

    const layoutWidth = appStore(state => state.layoutWidth)
    const setLayoutWidth = appStore(state => state.setLayoutWidth)

    const toggleLayoutWidth = () => {
        setLayoutWidth(
            layoutWidth === 'full'
                ? 'container'
                : 'full'
        )
    }

    const commonLinks = [
        { href: paths.postThread(), label: 'Post thread' }
    ]

    const links: { [key in Role]: { href: string, label: string }[] } = {
        user: [...commonLinks],
        admin: [...commonLinks],
        imperator: [
            ...commonLinks,
            { href: '/imperator-dashboard', label: 'Imperator dashboard' }
        ],
    }

    const liveSearchOpenState = useState(false)

    return (
        <header className='flex items-center justify-between h-24 border-b border-zinc-800 w-full sticky top-0 z-20 bg-zinc-900'>
            <Modal openState={liveSearchOpenState}>
                <LiveSearch<{ tag: string }>
                    onSearch={(query) => console.log(query)}
                    extractQuery={(suggestion) => suggestion.tag}
                    fetchSuggestions={(query) => [{ tag: 'OK' }, { tag: 'Wut' }].filter(item => item.tag.startsWith(query))}
                    renderSuggestion={(suggestion) => <div>{suggestion.tag}</div>}
                    extractSuggestionKey={(suggestion) => suggestion.tag}
                />
            </Modal>
            <div className={`flex flex-col h-full px-3 mx-auto ${layoutWidth === 'container' ? 'container' : 'w-full'}`}>
                <div className='flex items-end justify-between w-full h-full'>
                    <Link href={paths.home()}><span className='text-lg font-bold'>Logo</span></Link>
                    <nav className='grow ml-12 flex gap-3'>
                        <SessionStateWrapper
                            Guest={() => (
                                <>
                                    {commonLinks.map((link) => (
                                        <Link key={link.label} href={link.href}>{link.label}</Link>
                                    ))}
                                </>
                            )}
                            User={({ user: { role } }) => (
                                <>
                                    {links[role].map((link) => <Link key={link.label} href={link.href}>{link.label}</Link>)}
                                </>
                            )}
                        />
                    </nav>
                    <div>
                        <SessionStateWrapper
                            Guest={(signIn) => <button onClick={() => void signIn('discord')}>Sign in</button>}
                            User={(sessionData, signOut) => (
                                <div className='flex gap-3 text-lg items-center text-zinc-400 h-fit'>
                                    <UserAccountMenu image={sessionData.user.image ?? ''} id={sessionData.user.id} name={sessionData.user.name ?? ''} role={sessionData.user.role} signOut={signOut} />
                                    <button onClick={toggleLayoutWidth}><FiMail /></button>
                                    <button onClick={toggleLayoutWidth}><BiBell /></button>
                                    <button onClick={() => liveSearchOpenState[1](true)}><FiSearch /></button>
                                    <button onClick={toggleLayoutWidth}><AiOutlineColumnWidth /></button>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <div className='flex items-end w-full h-full text-sm pb-1'>
                    <div>A</div>
                    <div>A</div>
                    <div>A</div>
                    <div>A</div>
                    <div>A</div>
                </div>
            </div>
        </header>
    )
}

export default Header

const UserAccountMenu: React.FC<{
    id: string,
    image: string
    name: string
    role: Role
    signOut: () => Promise<void>
}> = ({
    id,
    image,
    name,
    role,
    signOut
}) => {
        const paths = usePaths()

        return (
            <Menu as="div" className="relative inline-block text-left">
                <div>
                    <Menu.Button className="inline-flex h-fit w-fit justify-center rounded-md text-sm font-medium text-white">
                        <UserAvatar
                            src={image}
                            alt=''
                            height={30}
                            width={30}
                        />
                    </Menu.Button>
                </div>
                <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-zinc-700  rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className='px-1 py-1'>
                            <Menu.Item>
                                <div className='flex gap-3'>
                                    <div className='w-fit h-fit items-start'>
                                        <UserAvatar
                                            src={image}
                                            alt=''
                                            height={40}
                                            width={40}
                                        />
                                    </div>
                                    <div>
                                        <div className='text-white'>{name}</div>
                                        <div className={USER_ROLE_THINGS[role].textColor}>{role}</div>
                                    </div>
                                </div>
                            </Menu.Item>
                        </div>
                        <div className='px-1 py-1'>
                            <Menu.Item>
                                <LinkButton href={paths.user(id)}>My profile</LinkButton>
                            </Menu.Item>
                        </div>
                        <div className="px-1 py-1">
                            <Menu.Item>
                                <button
                                    className='text-white hover:text-red-900 group flex w-full items-center rounded-md px-2 py-2 text-sm'
                                    onClick={() => void signOut()}
                                >
                                    Log out
                                </button>
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu>
        )
    }