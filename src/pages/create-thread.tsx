import { type NextPage } from "next";
import CreateThreadForm from "../components/common/Forms/CreateThreadForm";
import MainLayout from "../components/layout/MainLayout";

const PostThreadPage: NextPage = () => {
  return (
    <MainLayout>
      <CreateThreadForm />
    </MainLayout>
  );
};

export default PostThreadPage;
