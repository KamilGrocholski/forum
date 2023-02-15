import { type NextPage } from "next"
import { useRouter } from "next/router"
import CreateThreadForm from "../../../../components/common/Forms/CreateThreadForm"
import MainLayout from "../../../../components/layout/MainLayout"

const PostThreadPage: NextPage = () => {
  const router = useRouter()

  return (
    <MainLayout>
      <CreateThreadForm />
    </MainLayout>
  )
}

export default PostThreadPage