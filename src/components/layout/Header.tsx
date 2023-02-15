import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { appStore } from "../../store/appStore"
import { Modal } from "../common/Modal"

const Header = () => {
    const router = useRouter()
    const title = router.query.title as string
    const id = router.query.id as string

    const layoutWidth = appStore(state => state.layoutWidth)
    const setLayoutWidth = appStore(state => state.setLayoutWidth)

    const toggleLayoutWidth = () => {
        setLayoutWidth(
            layoutWidth === 'full'
                ? 'container'
                : 'full'
        )
    }

    return (
        <header className='flex items-center justify-between overflow-hidden h-12 border-b w-full sticky top-0 z-20 bg-zinc-900'>
            <div className={`flex items-center px-3 mx-auto ${layoutWidth === 'container' ? 'container' : 'w-full'}`}>
                <Link href='/'>Logo</Link>
                <nav className='grow ml-12 flex gap-3'>
                    <Link href='/forums'>Forums</Link>
                    <Link href='/whats-new'>{"What's new"}</Link>
                    <Link href='/tickets'>Tickets</Link>
                    <Link href='/post-thread'>Post thread</Link>
                </nav>
                <div>
                    <button onClick={toggleLayoutWidth}>Toggle</button>
                </div>
            </div>
        </header>
    )
}

export default Header