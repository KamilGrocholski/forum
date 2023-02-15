import { useEffect, useState } from "react"
import {
    BsPlus,
    BsSearch,
    BsEyeFill,
    BsBookmarkFill,
    BsFillArrowLeftSquareFill,
    BsPeopleFill,
    BsTerminalFill,
    BsFillArrowRightSquareFill
} from 'react-icons/bs'
import { AiFillFire, AiFillMessage, } from 'react-icons/ai'
import { IoMdArrowRoundUp } from 'react-icons/io'
import { MdNightlightRound, MdFeedback, MdAccountBox } from 'react-icons/md'
import { FaCog } from 'react-icons/fa'
import { VscSignIn } from 'react-icons/vsc'

import Image from 'next/image'
import { motion, useAnimation } from 'framer-motion'
import SessionStateWrapper from "../common/SessionStateWrapper"
import FallbackUserAvatar from '../../assets/default_avatar.jpg'

const data = [
    {
        name: 'Discover',
        items: [
            {
                title: 'Popular',
                icon: AiFillFire,
            },
            {
                title: 'Most Upvoted',
                icon: IoMdArrowRoundUp,
            },
            {
                title: 'Best Discussions',
                icon: AiFillMessage,
            },
            {
                title: 'Search',
                icon: BsSearch,
            },
        ]
    },
    {
        name: 'Manage',
        items: [
            {
                title: 'Bookmarks',
                icon: BsBookmarkFill,
            },
            {
                title: 'Reading history',
                icon: BsEyeFill,
            },
            {
                title: 'Focus Mode',
                icon: MdNightlightRound,
            },
            {
                title: 'Customize',
                icon: FaCog,
            },
        ]
    },
]


const SideNav: React.FC = () => {
    const [active, setActive] = useState(false)
    const controls = useAnimation()
    const controlText = useAnimation()
    const controlTitleText = useAnimation()

    const showFull = () => {
        void controls.start({
            width: '250px',
            transition: { duration: 0.005 }
        })

        void controlText.start({
            opacity: 1,
            display: 'block',
            transition: { delay: 0.3 }
        })

        void controlTitleText.start({
            opacity: 1,
            transition: { delay: 0.3 }
        })

        setActive(true)
    }

    const showSmall = () => {
        void controls.start({
            width: '55px',
            transition: { duration: 0.005 }
        })

        void controlText.start({
            opacity: 0,
            display: 'none',
        })

        void controlTitleText.start({
            opacity: 0,
        })

        setActive(false)
    }

    useEffect(() => {
        showFull()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <motion.aside animate={controls} className='min-h-screen max-w-[250px] animate duration-300 border-r border-gray-700 relative flex flex-col pb-10 group'>
            {active ?
                <BsFillArrowLeftSquareFill onClick={showSmall} className='absolute hidden text-2xl text-white cursor-pointer -right-4 top-10 group-hover:block ' />
                : <BsFillArrowRightSquareFill onClick={showFull} className='absolute text-2xl text-white cursor-pointer -right-4 top-10' />}

            <div className='max-w-[220px] h-[120px] flex justify-center mx-2  flex-col mb-4'>
                <SessionStateWrapper
                    Guest={(signIn) =>
                        <button onClick={() => void signIn('discord')} className='flex items-center mx-auto space-x-3'>
                            <VscSignIn className='text-4xl text-gray-500' />
                            <motion.p animate={controlText}>Sign in</motion.p>
                        </button>}
                    User={(sessionData, signOut) =>
                        <button onClick={void signOut}>
                            <Image
                                src={sessionData.user.image ?? FallbackUserAvatar}
                                alt=''
                                width={50}
                                height={50}
                            />
                            {active ? sessionData.user.name : null}
                        </button>}
                />
            </div>

            <div className='grow'>
                {data.map((group, groupIndex) => (
                    <div key={groupIndex} className='my-2'>
                        <motion.p animate={controlText} className='mb-2 ml-4 text-sm font-bold text-gray-500'>{group.name}</motion.p>
                        <div className='flex flex-col'>
                            {group.items.map((item, itemIndex) => (
                                <div key={itemIndex} className={`flex px-4 py-1 space-x-1 cursor-pointer items-center hover:bg-gray-500/30 ${active ? '' : 'h-12'}`}>
                                    <item.icon className={`text-gray-500 ${active ? 'text-lg' : 'text-2xl'}`} />
                                    <motion.span animate={controlText}>{item.title}</motion.span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </motion.aside >
    )
}

export default SideNav