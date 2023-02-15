import { Disclosure, Transition } from "@headlessui/react"
import { type NextPage } from "next"
import Link from "next/link"
import { useState } from "react"
import { SlArrowDown } from "react-icons/sl"
import CreateThreadForm from "../components/common/Forms/CreateThreadForm"
import { Modal } from "../components/common/Modal"
import StateWrapper from "../components/common/StateWrapper"
import MainLayout from "../components/layout/MainLayout"
import { api } from "../utils/api"

const PostThreadPage: NextPage = () => {
    const categoriesWithSubCategories = api.category.getAllWithSubCategories.useQuery()
    const modalState = useState(false)

    return (
        <MainLayout>
            <button onClick={() => modalState[1](true)}>Modal</button>
            <CreateThreadForm />
            <Modal openState={modalState}>
                <StateWrapper
                    data={categoriesWithSubCategories.data}
                    isLoading={categoriesWithSubCategories.isLoading}
                    isError={categoriesWithSubCategories.isError}
                    NonEmpty={(categories) => (
                        <div>
                            {categories.map((category) => (
                                <CategoryDisclosure
                                    key={category.id}
                                    category={{
                                        id: category.id,
                                        name: category.name
                                    }}
                                    subCategories={category.subCategories}
                                />
                            ))}
                        </div>
                    )}
                />
            </Modal>
        </MainLayout>
    )
}

export default PostThreadPage

const CategoryDisclosure: React.FC<{
    category: {
        id: string
        name: string
    },
    subCategories: {
        id: string
        name: string
    }[]
}> = ({
    category,
    subCategories
}) => {
        return (
            <Disclosure as='div' className='mb-6' defaultOpen={true}>
                {({ open }) => (
                    <>
                        <Disclosure.Button
                            className='flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm bg-red-900'
                        >
                            <span>{category.name}</span>
                            <SlArrowDown className={`text-lg transition-all duration-300 ease-in-out ${open ? 'rotate-180' : ''}`} />
                        </Disclosure.Button>

                        {/*
            Use the `Transition` + `open` render prop argument to add transitions.
          */}
                        <Transition
                            show={open}
                            enter="transition duration-100 ease-out"
                            enterFrom="transform scale-95 opacity-0"
                            enterTo="transform scale-100 opacity-100"
                            leave="transition duration-75 ease-out"
                            leaveFrom="transform scale-100 opacity-100"
                            leaveTo="transform scale-95 opacity-0"
                        >
                            {/*
              Don't forget to add `static` to your `Disclosure.Panel`!
            */}
                            <Disclosure.Panel
                                static
                                className='bg-zinc-900'
                            >
                                {subCategories.map((subCategory) => (
                                    <div
                                        key={subCategory.id}
                                        className='border-t border-white/30 py-2 px-3'
                                    >
                                        <Link href={`/forum/${category.name}/${subCategory.id}`}>
                                            {subCategory.name}
                                        </Link>
                                    </div>
                                ))}
                            </Disclosure.Panel>
                        </Transition>
                    </>
                )}
            </Disclosure>
        )
    }