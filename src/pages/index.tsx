import { Disclosure, Tab, Transition } from "@headlessui/react";
import { type NextPage } from "next";
import StateWrapper from "../components/common/StateWrapper";
import MainLayout from "../components/layout/MainLayout";
import React, { Fragment } from "react";
import SidebarForumInfo from "../components/common/SidebarForumInfo";
import { api, type RouterOutputs } from "../utils/api";
import { SlArrowDown } from "react-icons/sl";
import { BiCommentDetail } from "react-icons/bi";
import usePaths from "../hooks/usePaths";
import LinkButton from "../components/common/LinkButton";
import { formatDateToDisplay } from "../utils/formatDateToDisplay";
import { USER_ROLE_THINGS } from "../utils/userRoleThings";

const Home: NextPage = () => {

  const categoriesWithSubCategories = api.category.getAllWithSubCategories.useQuery()

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
        <SidebarForumInfo />
      </div>
    </MainLayout>
  );
};

export default Home;

const ForumActionsInfo: React.FC = () => {
  const getLatestPosts = api.post.getLatest.useQuery()
  const getLatestThreads = api.thread.getLatest.useQuery()

  const paths = usePaths()

  return (
    <Tab.Group>
      <Tab.List>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-800 text-red-900' : 'bg-zinc-900'}`}>Latest replies</button>}</Tab>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-800 text-red-900' : 'bg-zinc-900'}`}>Latest Threads</button>}</Tab>
        <Tab as={Fragment}>{({ selected }) => <button className={`p-2 rounded-t-sm hover:text-white ${selected ? 'bg-zinc-800 text-red-900' : 'bg-zinc-900'}`}>Latest updates</button>}</Tab>
      </Tab.List>
      <Tab.Panels>
        <Tab.Panel className='flex flex-col bg-zinc-800'>
          <StateWrapper
            data={getLatestPosts.data}
            isLoading={getLatestPosts.isLoading}
            isError={getLatestPosts.isError}
            NonEmpty={posts => <>
              {posts.map((post) => (
                <ForumActionsInfoRow
                  key={post.id}
                  first={<LinkButton href={paths.thread(post.thread.id)}>{post.thread.title}</LinkButton>}
                  second={formatDateToDisplay(post.createdAt)}
                  third={<LinkButton href={paths.user(post.user.id)} className={USER_ROLE_THINGS[post.user.role].textColor}>{post.user.name}</LinkButton>}
                />
              ))}
            </>
            }
          />
        </Tab.Panel>
        <Tab.Panel className='flex flex-col bg-zinc-800'>
          <StateWrapper
            data={getLatestThreads.data}
            isLoading={getLatestThreads.isLoading}
            isError={getLatestThreads.isError}
            NonEmpty={threads => <>
              {threads.map((thread) => (
                <ForumActionsInfoRow
                  key={thread.id}
                  first={<LinkButton href={paths.thread(thread.id)}>{thread.title}</LinkButton>}
                  second={formatDateToDisplay(thread.createdAt)}
                  third={<LinkButton href={paths.user(thread.user.id)} className={USER_ROLE_THINGS[thread.user.role].textColor}>{thread.user.name}</LinkButton>}
                />
              ))}
            </>
            }
          />
        </Tab.Panel>
        <Tab.Panel className='flex flex-col bg-zinc-800'>
          <StateWrapper
            data={getLatestPosts.data}
            isLoading={getLatestPosts.isLoading}
            isError={getLatestPosts.isError}
            NonEmpty={posts => <>
              {posts.map((post) => (
                <ForumActionsInfoRow
                  key={post.id}
                  first={post.thread.title}
                  second={post.user.name}
                  third={formatDateToDisplay(post.createdAt)}
                />
              ))}
            </>
            }
          />
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
    const paths = usePaths()

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
                    className='border-t first:border-none border-white/30 py-2 px-3 grid grid-cols-4 gap-3'
                  >
                    <div className='flex gap-3 col-span-2 items-center'>
                      <BiCommentDetail className='text-2xl text-red-900' />
                      <LinkButton href={paths.subCategoryId(categoryInfo.name, subCategory.id)} className='hover:underline'>
                        {subCategory.name}
                      </LinkButton>
                    </div>
                    <div className='flex justify-end gap-3'>
                      <div>Threads {subCategory._count.threads}</div>
                      <div>Posts {subCategory.threads.reduce((sum, cur) => sum + cur._count.posts, 0)}</div>
                    </div>
                    <div className='flex justify-end'>
                      <div className='min-w-0'>
                        {!subCategory.threads[0]?.id
                          ? 'No threads'
                          :
                          <LinkButton
                            href={paths.thread(subCategory.threads[0].id)}
                            className='hover:underline truncate block'
                          >
                            {subCategory.threads[0].title}
                          </LinkButton>}
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
