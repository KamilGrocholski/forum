import { type NextPage } from "next"
import { useRouter } from "next/router"
import StateWrapper from "../../../../components/common/StateWrapper"
import MainLayout from "../../../../components/layout/MainLayout"
import { api } from "../../../../utils/api"
import usePaths from "../../../../hooks/usePaths"
import LinkButton from "../../../../components/common/LinkButton"
import ImageWithFallback from "../../../../components/common/ImageWithFallback"
import { useState } from "react"
import Pagination from "../../../../components/common/Pagination"

const SubCategoryPage: NextPage = () => {
  const router = useRouter()
  const subCategoryId = router.query.subCategoryId as string
  const pageFromQuery = router.query.page as string
  const paths = usePaths()

  const [page, setPage] = useState(0)

  const threadsPagination = api.subCategory.threadsPagination.useInfiniteQuery({
    subCategoryId,
    limit: 3,
  }, {
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })


  return (
    <MainLayout>
      <StateWrapper
        data={threadsPagination.data}
        isLoading={threadsPagination.isLoading}
        isError={threadsPagination.isError}
        NonEmpty={(threads) => (
          <>
            <div className='flex flex-col space-y-3'>
              {threads.pages[page]?.threads.map((thread) => (
                <div key={thread.id} className='grid grid-cols-6 items-center'>
                  <div>
                    <ImageWithFallback
                      src={thread.user.image ?? ''}
                      fallbackSrc={''}
                      alt=''
                      height={50}
                      width={50}
                      className='rounded-full'
                    />
                  </div>
                  <div className='col-span-2 min-w-0'>
                    <LinkButton href={paths.thread(thread.id)} className='hover:underline truncate block'>
                      {thread.title}
                    </LinkButton>
                  </div>
                  <div>ratings</div>
                  <div>
                    <div>Replies: {thread._count.posts}</div>
                    <div>Views: {thread._count.views}</div>
                  </div>
                  <div>
                    <div>
                      {thread.posts[0]?.user.name}
                    </div>
                    <div>
                      <ImageWithFallback
                        src={thread.posts[0]?.user.image ?? ''}
                        fallbackSrc={''}
                        height={50}
                        width={50}
                        alt=''
                        className='rounded-full'
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              hasNext={!!threadsPagination.hasNextPage}
              hasPrev={!!threadsPagination.hasPreviousPage}
              pages={threads.pages.length}
              goTo={(page) => setPage(page)}
              goToNext={async () => {
                await threadsPagination.fetchNextPage()
                setPage(prev => prev + 1)
              }}
              goToPrev={async () => {
                await threadsPagination.fetchPreviousPage()
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