import { type NextPage } from "next"
import { useRouter } from "next/router"
import StateWrapper from "../../../../components/common/StateWrapper"
import MainLayout from "../../../../components/layout/MainLayout"
import { api } from "../../../../utils/api"
import usePaths from "../../../../hooks/usePaths"
import LinkButton from "../../../../components/common/LinkButton"
import { useState } from "react"
import Pagination from "../../../../components/common/Pagination"
import UserAvatar from "../../../../components/common/UserAvatar"

const SubCategoryPage: NextPage = () => {
  const router = useRouter()
  const subCategoryId = router.query.subCategoryId as string
  const pageFromQuery = router.query.page as string
  const paths = usePaths()

  const [page, setPage] = useState(0)

  const threadsPagination = api.subCategory.threadsPagination.useQuery({
    subCategoryId,
    limit: 3,
    page
  }, {
    keepPreviousData: true
  })


  return (
    <MainLayout>
      <StateWrapper
        data={threadsPagination.data}
        isLoading={threadsPagination.isLoading}
        isError={threadsPagination.isError}
        NonEmpty={(threads) => (
          <>
            <Pagination
              className='mb-5'
              currentPage={page}
              pages={threads.totalPages}
              goTo={(page) => setPage(page)}
              goToNext={() => {
                setPage(prev => prev + 1)
              }}
              goToPrev={() => {
                setPage(prev => prev - 1)
              }}
            />
            <div className='flex flex-col p-3 bg-zinc-900 rounded'>
              {threads.threads.map((thread) => (
                <div key={thread.id} className='grid grid-cols-6 items-center border-b py-3 border-zinc-700 last:border-none hover:bg-zinc-800'>

                  {/* Thread creator  */}
                  <LinkButton href={paths.user(thread.user.id)} className='group w-fit relative'>
                    <UserAvatar
                      width={50}
                      height={50}
                      alt=''
                      src={thread.user.image}
                      className='group-hover:outline outline-red-900 group-hover:scale-105 transition-transform duration-300 ease-in-out'
                    />
                    <div className='absolute top-0 left-24 group-hover:block hidden bg-zinc-800 px-3 py-1 rounded'>{thread.user.name}</div>
                  </LinkButton>

                  {/* Thread link  */}
                  <div className='col-span-2 min-w-0'>
                    <LinkButton href={paths.thread(thread.id)} className='hover:underline truncate block font-semibold'>
                      {thread.title}
                    </LinkButton>
                  </div>

                  {/* Thread rating  */}
                  <div>ratings</div>
                  <div>
                    <div>Replies: {thread._count.posts}</div>
                    <div>Views: {thread._count.views}</div>
                  </div>

                  {/* Latest post's creator */}
                  <div>
                    {thread.posts[0]?.user.id
                      ? <LinkButton
                        href={paths.user(thread.posts[0].user.id)}
                        className='flex gap-2 items-center'
                      >
                        <UserAvatar
                          width={20}
                          height={20}
                          alt=''
                          src={thread.posts[0].user.image}
                        />
                        <span className='truncate block'>
                          {thread.posts[0].user.name}
                        </span>
                      </LinkButton>
                      : <span>No posts</span>}
                  </div>

                </div>
              ))}
            </div>
            <Pagination
              className='mt-5'
              currentPage={page}
              pages={threads.totalPages}
              goTo={(page) => setPage(page)}
              goToNext={() => {
                setPage(prev => prev + 1)
              }}
              goToPrev={() => {
                setPage(prev => prev - 1)
              }}
            />
          </>
        )}
      />
    </MainLayout>
  )
}

export default SubCategoryPage