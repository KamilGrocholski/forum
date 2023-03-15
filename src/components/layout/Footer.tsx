import { appStore } from "../../store/appStore";
import { FcAbout } from "react-icons/fc";
import { RiNavigationFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import { ImStatsBars } from "react-icons/im";
import usePaths from "../../hooks/usePaths";
import LinkButton from "../common/LinkButton";
import { api } from "../../utils/api";
import StateWrapper from "../common/StateWrapper";
import SmallLoader from "../common/SmallLoader";
import { USER_ROLE_THINGS } from "../../utils/userRoleThings";
import UserAvatar from "../common/UserAvatar";
import SessionStateWrapper from "../common/SessionStateWrapper";
import { User } from "next-auth";
import { useCurrentMemberCount, PusherProvider } from "../../utils/Pusher";

const Footer: React.FC = () => {
  const layoutWidth = appStore((state) => state.layoutWidth);
  const paths = usePaths();
  const threadsCount = api.thread.count.useQuery();
  const postsCount = api.post.count.useQuery();
  const usersCount = api.user.count.useQuery();
  const lastNewUser = api.user.getLastNewUser.useQuery();

  return (
    <footer className="border-t-4 border-red-900 bg-zinc-900 pt-3">
      <div
        className={`flex flex-col space-y-3 px-3 ${
          layoutWidth === "container" ? "container mx-auto" : "w-full"
        }`}
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-900">
              <FcAbout />
              <span>About us</span>
            </h2>
            <div>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eveniet,
              sapiente ipsum veritatis accusamus aspernatur, nemo perspiciatis
              facilis cum nisi repellat dolor quisquam in vero natus, aliquid
              asperiores. Officiis, architecto rerum!
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-900">
              <RiNavigationFill />
              <span>Navigation</span>
            </h2>
            <div className="flex flex-col">
              <LinkButton href={paths.home()}>Home</LinkButton>
              <LinkButton href={paths.createThread()}>Create thread</LinkButton>
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-900">
              <FaUserAlt />
              <span>User navigation</span>
            </h2>
            <div>
              <SessionStateWrapper
                Guest={(signIn) => (
                  <div>
                    <button onClick={signIn}>Sign in</button>
                  </div>
                )}
                User={(sessionData) => (
                  <div className="flex flex-col">
                    <LinkButton href={paths.user(sessionData.user.id)}>
                      Profile
                    </LinkButton>
                  </div>
                )}
              />
            </div>
          </div>
          <div>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-900">
              <ImStatsBars />
              <span>Forum statistics</span>
            </h2>
            <div>
              <div className="flex items-center justify-between">
                <span>Threads:</span>
                <StateWrapper
                  data={threadsCount.data}
                  isLoading={threadsCount.isLoading}
                  isError={threadsCount.isError}
                  NonEmpty={(count) => <span>{count}</span>}
                  Loading={<SmallLoader />}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Posts:</span>
                <StateWrapper
                  data={postsCount.data}
                  isLoading={postsCount.isLoading}
                  isError={postsCount.isError}
                  NonEmpty={(count) => <span>{count}</span>}
                  Loading={<SmallLoader />}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Members:</span>
                <StateWrapper
                  data={usersCount.data}
                  isLoading={usersCount.isLoading}
                  isError={usersCount.isError}
                  NonEmpty={(count) => <span>{count}</span>}
                  Loading={<SmallLoader />}
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Online members:</span>
                <OnlineMembersWrapper userId="no-slug" />
              </div>
              <div className="flex items-center justify-between">
                <span className="mr-2 whitespace-nowrap">New member:</span>
                <StateWrapper
                  data={lastNewUser.data}
                  isLoading={lastNewUser.isLoading}
                  isError={lastNewUser.isError}
                  NonEmpty={(user) => (
                    <LinkButton
                      className="flex items-center gap-1"
                      href={paths.user(user.id)}
                    >
                      <UserAvatar
                        width={10}
                        height={10}
                        alt=""
                        src={user.image}
                      />
                      <span
                        className={`block truncate ${
                          USER_ROLE_THINGS[user.role].textColor
                        }`}
                      >
                        {user.name}
                      </span>
                    </LinkButton>
                  )}
                  Loading={<SmallLoader />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 h-8 bg-zinc-800  px-3 text-center">Copy right</div>
    </footer>
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

export default Footer;
