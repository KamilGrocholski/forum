import { type NextPage } from "next"
import { useRouter } from "next/router"
import StateWrapper from "../../components/common/StateWrapper"
import UserAvatar from "../../components/common/UserAvatar"
import MainLayout from "../../components/layout/MainLayout"
import { api } from "../../utils/api"

const UserProfilePage: NextPage = () => {
  const router = useRouter()
  const userId = router.query.userId as string
  const userProfileQuery = api.user.getProfile.useQuery({ userId })

  return (
    <MainLayout>
      <StateWrapper
        data={userProfileQuery.data}
        isLoading={userProfileQuery.isLoading}
        isError={userProfileQuery.isError}
        NonEmpty={(user) => (
          <div className='flex gap-1 p-3 rounded bg-zinc-900'>
            <UserAvatar
              width={80}
              height={80}
              alt=''
              src={user.image}
            />
            <div className='text-xl font-semibold'>{user.name}</div>
          </div>
        )}
      />
    </MainLayout>
  )
}

export default UserProfilePage