import { type NextPage } from "next";
import { useRouter } from "next/router";
import StateWrapper from "../../components/common/StateWrapper";
import UserAvatar from "../../components/common/UserAvatar";
import MainLayout from "../../components/layout/MainLayout";
import usePaths from "../../hooks/usePaths";
import { api, type RouterOutputs } from "../../utils/api";
import LinkButton from "../../components/common/LinkButton";
import { formatDateToDisplay } from "../../utils/formatDateToDisplay";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userProfileQuery = api.user.getProfile.useQuery({ userId });
  const w = api.user.changeRole.useMutation();

  return (
    <MainLayout>
      <StateWrapper
        data={userProfileQuery.data}
        isLoading={userProfileQuery.isLoading}
        isError={userProfileQuery.isError}
        NonEmpty={(user) => (
          <>
            <div className="flex gap-1 rounded bg-zinc-900 p-3">
              <UserAvatar width={80} height={80} alt="" src={user.image} />
              <div className="text-xl font-semibold">{user.name}</div>
              <button onClick={() => w.mutate({ userId, role: "imperator" })}>
                Role
              </button>
            </div>
            <UserThreadsList threads={user.threads} />
          </>
        )}
      />
    </MainLayout>
  );
};

export default UserProfilePage;

const UserThreadsList: React.FC<{
  threads: NonNullable<RouterOutputs["user"]["getProfile"]>["threads"];
}> = ({ threads }) => {
  const paths = usePaths();

  return (
    <div className="flex flex-col space-y-3 bg-zinc-900 p-3">
      {threads.map((thread) => (
        <div key={thread.id}>
          <LinkButton href={paths.thread(thread.id)}>
            <div>{thread.title}</div>
            <div>{formatDateToDisplay(thread.createdAt)}</div>
            <div>{thread.subCategory.name}</div>
          </LinkButton>
        </div>
      ))}
    </div>
  );
};
