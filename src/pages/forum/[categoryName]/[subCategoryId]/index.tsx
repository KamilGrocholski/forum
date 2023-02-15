import { type NextPage } from "next"
import { useRouter } from "next/router"
import StateWrapper from "../../../../components/common/StateWrapper"
import MainLayout from "../../../../components/layout/MainLayout"
import { api } from "../../../../utils/api"
import Image from 'next/image'
import Link from "next/link"

const SubCategoryPage: NextPage = () => {
  const router = useRouter()
  const subCategoryId = router.query.subCategoryId as string

  const threads = api.subCategory.getThreads.useQuery({ subCategoryId })

  return (
    <MainLayout>
      <StateWrapper
        data={threads.data}
        isLoading={threads.isLoading}
        isError={threads.isError}
        NonEmpty={(threads) => (
          <div>
            {threads.map((thread) => (
              <div key={thread.id} className='grid grid-cols-6'>
                <div>
                  <Image
                    src={thread.user.image ?? ''}
                    alt=''
                    height={50}
                    width={50}
                  />
                </div>
                <div className='col-span-2'>
                  <Link href={`/threads/${thread.id}`} className='hover:underline'>
                    {thread.title}
                  </Link>
                </div>
                <div>ratings</div>
                <div>
                  <div>Replies: {thread._count.posts}</div>
                  <div>Views: {thread._count.views}</div>
                </div>
                <div>
                  <div>{thread.posts[0]?.user.name}</div>
                  <div>
                    <Image
                      src={thread.posts[0]?.user.image ?? ''}
                      height={50}
                      width={50}
                      alt=''
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      />
    </MainLayout>
  )
}

export default SubCategoryPage