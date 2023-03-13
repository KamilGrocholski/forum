import { type NextPage } from "next";
import { useRouter } from "next/router";
import StateWrapper from "../../components/common/StateWrapper";
import UserAvatar from "../../components/common/UserAvatar";
import MainLayout from "../../components/layout/MainLayout";
import usePaths from "../../hooks/usePaths";
import { api, type RouterOutputs } from "../../utils/api";
import LinkButton from "../../components/common/LinkButton";
import { formatDateToDisplay } from "../../utils/formatDateToDisplay";
import { USER_ROLE_THINGS } from "../../utils/userRoleThings";

const UserProfilePage: NextPage = () => {
  const router = useRouter();
  const userId = router.query.userId as string;
  const userProfileQuery = api.user.getProfile.useQuery({ userId });

  return (
    <MainLayout>
      <StateWrapper
        data={userProfileQuery.data}
        isLoading={userProfileQuery.isLoading}
        isError={userProfileQuery.isError}
        NonEmpty={(user) => (
          <>
            <div className="flex gap-2 rounded bg-zinc-900 p-3">
              <UserAvatar width={80} height={80} alt="" src={user.image} />
              <div className="flex flex-col">
                <div
                  className={`text-xl font-semibold ${
                    USER_ROLE_THINGS[user.role].textColor
                  }`}
                >
                  {user.name}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-zinc-500">role</span>
                  <span className={USER_ROLE_THINGS[user.role].textColor}>
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-sm text-zinc-500">member since</span>
                  <span className="text-white">
                    {formatDateToDisplay(user.createdAt)}
                  </span>
                </div>
              </div>
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
        <div key={thread.id} className="">
          <LinkButton href={paths.thread(thread.id)}>
            <div className="text-2xl font-semibold">{thread.title}</div>
            <div className="text-xs">
              {formatDateToDisplay(thread.createdAt)}
            </div>
            <div className="font-semibold">{thread.subCategory.name}</div>
          </LinkButton>
        </div>
      ))}
    </div>
  );
};
