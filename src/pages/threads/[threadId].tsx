import { type NextPage } from "next"
import { useRouter } from "next/router"
import StateWrapper from "../../components/common/StateWrapper"
import MainLayout from "../../components/layout/MainLayout"
import { api } from "../../utils/api"

const ThreadPage: NextPage = () => {
    const router = useRouter()
    const threadId = router.query.threadId as string
    const threadQuery = api.thread.getById.useQuery({ id: threadId })

    return (
        <MainLayout>
            <StateWrapper
                data={threadQuery.data}
                isLoading={threadQuery.isLoading}
                isError={threadQuery.isError}
                NonEmpty={(thread) => (
                    <div>
                        {thread.title}
                    </div>
                )}
            />
        </MainLayout>
    )
}

export default ThreadPage