import { FaComment } from "react-icons/fa";
import { api } from "../../utils/api";
import { formatDateToDisplay } from "../../utils/formatDateToDisplay";
import Dot from "./Dot";
import StateWrapper from "./StateWrapper";
import usePaths from "../../hooks/usePaths";
import LinkButton from "./LinkButton";
import UserAvatar from "./UserAvatar";
import type { User } from "@prisma/client";
import { PusherProvider, useCurrentMemberCount } from "../../utils/Pusher";
import { HiUsers } from "react-icons/hi";

const SidebarForumInfo: React.FC = () => {
  const paths = usePaths();
  const latestThreads = api.thread.getLatest.useQuery();
  // const latestPosts = api.post.getLatest.useQuery()

  return (
    <div className="hidden w-[300px] lg:block">
      <h1 className="flex items-center gap-3 px-3 text-lg font-semibold">
        <HiUsers />
        <span>Online</span>
      </h1>
      <div className="flex gap-3 rounded-sm bg-zinc-900 p-2">
        <OnlineMembersWrapper userId={""} />
      </div>
      <h1 className="flex items-center gap-3 px-3 text-lg font-semibold">
        <FaComment />
        <span>Latest posts</span>
      </h1>
      <div className="rounded-sm bg-zinc-900 p-2">
        <StateWrapper
          data={latestThreads.data}
          isLoading={latestThreads.isLoading}
          isError={latestThreads.isError}
          NonEmpty={(latestThreads) => (
            <>
              {latestThreads.map((thread) => (
                <div key={thread.id} className="flex items-center gap-3">
                  <LinkButton
                    href={paths.user(thread.user.id)}
                    className="min-w-fit"
                  >
                    <UserAvatar
                      src={thread.user.image}
                      alt=""
                      height={30}
                      width={30}
                    />
                  </LinkButton>
                  <div className="min-w-0">
                    <LinkButton
                      href={paths.thread(thread.id)}
                      className="block truncate font-semibold text-red-900 hover:underline"
                    >
                      {thread.title}
                    </LinkButton>
                    <div className="flex items-center gap-2 text-xs">
                      {/* <LinkButton
                        href={paths.subCategoryId(
                          thread.subCategory.category.name,
                          thread.subCategory.id
                        )}
                        className="underline"
                      >
                        {thread.subCategory.category.name}
                      </LinkButton> */}
                      <Dot />
                      <span>{formatDateToDisplay(thread.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        />
      </div>
    </div>
  );
};

const OnlineMembers = () => {
  const membersOnline = useCurrentMemberCount();

  return <div>{membersOnline}</div>;
};

const OnlineMembersWrapper: React.FC<{ userId: User["id"] }> = ({ userId }) => {
  return (
    <PusherProvider slug={userId}>
      <OnlineMembers />
    </PusherProvider>
  );
};

export default SidebarForumInfo;
