import { Disclosure, Tab, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import CreateCategoryForm from "../components/common/Forms/CreateCategoryForm";
import CreateSubCategoryForm from "../components/common/Forms/CreateSubCategoryForm";
import CreateThreadForm from "../components/common/Forms/CreateThreadForm";
import StateWrapper from "../components/common/StateWrapper";
import MainLayout from "../components/layout/MainLayout";
import { api, RouterOutputs } from "../utils/api";
import { SlArrowDown } from 'react-icons/sl'
import { BiCommentDetail } from 'react-icons/bi'
import { FaComment } from 'react-icons/fa'
import React, { Fragment } from "react";

const Home: NextPage = () => {

  const categoriesWithSubCategories = api.category.getAllWithSubCategories.useQuery()
  const latestThreads = api.thread.getLatest.useQuery()

  return (
    <MainLayout>
      <div className='flex flex-row gap-3'>
        <div className='w-full'>
          <StateWrapper
            data={categoriesWithSubCategories.data}
            isLoading={categoriesWithSubCategories.isLoading}
            isError={categoriesWithSubCategories.isError}
            NonEmpty={(categories) => (
              <div>
                {categories.map((category) => (
                  <CategoryDisclosure
                    key={category.id}
                    categoryInfo={{
                      id: category.id,
                      name: category.name,
                      subCategories: category.subCategories
                    }}
                  />
                ))}
              </div>
            )}
          />
          <ForumActionsInfo />
        </div>
        <div>
          <StateWrapper
            data={latestThreads.data}
            isLoading={latestThreads.isLoading}
            isError={latestThreads.isError}
            NonEmpty={(threads) => (
              <SidebarForumInfo latestThreads={threads} />
            )}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Home;

const SidebarForumInfo: React.FC<{
  latestThreads: RouterOutputs['thread']['getLatest']
}> = ({ latestThreads }) => {
  return (
    <div className='w-[250px]'>
      <h1 className='flex gap-3 items-center px-3 text-lg font-semibold'>
        <FaComment />
        <span>Latest posts</span>
      </h1>
      <div className='bg-zinc-900 p-2 rounded-sm'>
        {latestThreads.map(thread => (
          <div key={thread.id}>
            <div>{thread.user.name}</div>
            <div>
              <Link href={`/threads/${thread.id}`} className='hover:underline'>{thread.title}</Link>
              <div>
                <span>{thread.subCategory.name}</span>
                <span>{thread.createdAt.toString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const exampleData = {
  replies: [
    { title: '3115411hn21Ok', time: 'A moment ago', user: 'Username' },
    { title: 'O4124121k', time: 'A moment ago', user: 'Username' },
    { title: '1412Ok13131', time: 'A moment ago', user: 'Username' },
  ],
  threads: [
    { title: 'Okqweqweqwewqw', time: 'A moment ago', user: 'Username' },
    { title: 'Okqeqdfqfqwqe', time: 'A moment ago', user: 'Username' },
    { title: 'Okqwr21341231', time: 'A moment ago', user: 'Username' },
  ],
  updates: [
    { title: 'Ok31412g1', time: 'A moment ago', replies: 412341 },
    { title: 'Ok1112', time: 'A moment ago', replies: 1231241 },
    { title: 'Okeqwe', time: 'A moment ago', replies: 9941 },
  ]
}

const ForumActionsInfo: React.FC = () => {

  return (
    <Tab.Group>
      <Tab.List>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-900' : ''}`}>Latest replies</button>}</Tab>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-900' : ''}`}>Latest Threads</button>}</Tab>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-900' : ''}`}>Latest updates</button>}</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className='flex flex-col bg-zinc-900'>
          {exampleData.replies.map((reply) =>
            <ForumActionsInfoRow
              key={reply.time + reply.title + reply.user}
              first={reply.title}
              second={reply.time}
              third={reply.user}
            />
          )}
        </Tab.Panel>
        <Tab.Panel className='flex flex-col bg-zinc-900'>
          {exampleData.threads.map((reply) => (
            <ForumActionsInfoRow
              key={reply.time + reply.title + reply.user}
              first={reply.title}
              second={reply.time}
              third={reply.user}
            />
          ))}
        </Tab.Panel>
        <Tab.Panel className='flex flex-col bg-zinc-900'>
          {exampleData.updates.map((reply) => (
            <ForumActionsInfoRow
              key={reply.time + reply.title + reply.replies.toString()}
              first={reply.title}
              second={reply.time}
              third={reply.replies}
            />
          ))}
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  )
}

const ForumActionsInfoRow: React.FC<{
  first: React.ReactNode
  second: React.ReactNode
  third: React.ReactNode
}> = ({
  first,
  second,
  third
}) => {

    return (
      <div className='grid grid-cols-4 hover:bg-zinc-800 border-b border-zinc-600 px-1 py-0.5 last:border-none'>
        <div className='col-span-2'>{first}</div>
        <div className='text-end'>{second}</div>
        <div className='text-end'>{third}</div>
      </div>
    )
  }

const CategoryDisclosure: React.FC<{
  categoryInfo: RouterOutputs['category']['getAllWithSubCategories'][number]
}> = ({
  categoryInfo
}) => {
    return (
      <Disclosure as='div' className='mb-6' defaultOpen={true}>
        {({ open }) => (
          <>
            <Disclosure.Button
              className='flex w-full items-center justify-between rounded-sm px-3 py-2 text-left text-sm bg-red-900'
            >
              <span className='text-lg font-semibold'>{categoryInfo.name}</span>
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
                {categoryInfo.subCategories.map((subCategory) => (
                  <div
                    key={subCategory.id}
                    className='border-t border-white/30 py-2 px-3 grid grid-cols-4'
                  >
                    <div className='flex gap-3 col-span-2 items-center'>
                      <BiCommentDetail className='text-2xl text-red-900' />
                      <Link href={`/forum/${categoryInfo.name}/${subCategory.id}`} className='hover:underline'>
                        {subCategory.name}
                      </Link>
                    </div>
                    <div className='flex justify-end gap-3'>
                      <div>Threads {subCategory._count.threads}</div>
                      <div>Posts {subCategory.threads.reduce((sum, cur) => sum + cur._count.posts, 0)}</div>
                    </div>
                    <div className='flex justify-end'>
                      <div>
                        {!subCategory.threads[0]
                          ? 'No threads'
                          : <Link
                            href={`/threads/${subCategory.threads[0]?.id}`}
                            className='hover:underline'
                          >
                            {subCategory.threads[0]?.title}
                          </Link>}
                      </div>
                    </div>
                  </div>
                ))}
              </Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    )
  }