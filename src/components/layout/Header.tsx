import { Menu, Transition } from "@headlessui/react";
import type { Role, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Fragment, useRef, useState } from "react";
import { AiOutlineColumnWidth } from "react-icons/ai";
import { BiBell } from "react-icons/bi";
import { FiSearch } from "react-icons/fi";
import useOnClickOutside from "../../hooks/useClickOutside";
import useDebounce from "../../hooks/useDebounce";
import usePaths from "../../hooks/usePaths";
import { appStore } from "../../store/appStore";
import { PusherProvider, useSubscribeToEvent } from "../../utils/Pusher";
import { api, type RouterOutputs } from "../../utils/api";
import { USER_ROLE_THINGS } from "../../utils/userRoleThings";
import Indicator from "../common/Indicator";
import LinkButton from "../common/LinkButton";
import LiveSearch from "../common/LiveSearch";
import { Modal } from "../common/Modal";
import SessionStateWrapper from "../common/SessionStateWrapper";
import StateWrapper from "../common/StateWrapper";
import UserAvatar from "../common/UserAvatar";
import Button from "../common/Button";

const Header = () => {
  const paths = usePaths();
  const router = useRouter();
  const { data: session } = useSession();

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationBtnRef = useRef<HTMLButtonElement | null>(null);
  useOnClickOutside(notificationBtnRef, () => setNotificationsOpen(false));

  const unseenNotificationsCounterQuery = api.notification.countUnseen.useQuery(
    undefined,
    {
      refetchOnMount: false,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      enabled: !!session?.user.id,
    }
  );

  const changeNotificationsToSeenMutation =
    api.notification.changeToSeen.useMutation({
      onSuccess: () => {
        void unseenNotificationsCounterQuery.refetch();
      },
      onError: (err) => {
        console.error(err);
      },
    });

  const handleNotificationsToggle = () => {
    if (!notificationsOpen) {
      setNotificationsOpen(true);
      void changeNotificationsToSeenMutation.mutate();
      return;
    }

    setNotificationsOpen(false);
  };

  const layoutWidth = appStore((state) => state.layoutWidth);
  const setLayoutWidth = appStore((state) => state.setLayoutWidth);

  const toggleLayoutWidth = () => {
    setLayoutWidth(layoutWidth === "full" ? "container" : "full");
  };

  const commonLinks = [{ href: paths.createThread(), label: "Create thread" }];

  const links: { [key in Role]: { href: string; label: string }[] } = {
    user: [...commonLinks],
    admin: [...commonLinks],
    imperator: [
      ...commonLinks,
      { href: "/imperator-dashboard", label: "Imperator dashboard" },
    ],
  };

  const liveSearchOpenState = useState(false);

  const [query, setQuery] = useState<string>("");
  const debouncedQuery = useDebounce(query);
  const searchThreads = api.thread.search.useQuery({ query: debouncedQuery });

  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-24 w-full items-center justify-between border-b border-zinc-800 bg-zinc-900">
      <Modal openState={liveSearchOpenState}>
        <LiveSearch<NonNullable<RouterOutputs["thread"]["search"][number]>>
          onEnter={(selected) =>
            void router.push(`/${paths.thread(selected.id)}`)
          }
          extractQuery={(suggestion) => suggestion.title}
          suggestions={searchThreads.data ?? []}
          queryState={[query, setQuery]}
          renderSuggestion={(suggestion) => <div>{suggestion.title}</div>}
          extractSuggestionKey={(suggestion) => suggestion.id}
        />
      </Modal>
      <Modal openState={[isNavMenuOpen, setIsNavMenuOpen]}>
        <SessionStateWrapper
          Guest={() => (
            <div className="flex flex-col divide-y">
              {commonLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="p-3 text-lg font-semibold text-red-500 hover:bg-gray-500/30"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          User={({ user: { role } }) => (
            <div className="flex flex-col divide-y">
              {links[role].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="p-3 text-lg font-semibold text-red-500 hover:bg-gray-500/30"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
        />
      </Modal>
      <div
        className={`mx-auto flex h-full flex-col items-center px-3 ${
          layoutWidth === "container" ? "container" : "w-full"
        }`}
      >
        <div className="flex h-full w-full items-center justify-between">
          <Link href={paths.home()}>
            <span className="text-lg font-bold">Forum</span>
          </Link>
          <nav className="ml-12 hidden grow gap-3 lg:flex">
            <SessionStateWrapper
              Guest={() => (
                <>
                  {commonLinks.map((link) => (
                    <Link key={link.label} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
              User={({ user: { role } }) => (
                <>
                  {links[role].map((link) => (
                    <Link key={link.label} href={link.href}>
                      {link.label}
                    </Link>
                  ))}
                </>
              )}
            />
          </nav>
          <div className="ml-2 flex grow items-center gap-3 lg:hidden">
            <Button
              variant="transparent"
              onClick={() => setIsNavMenuOpen(true)}
            >
              Menu
            </Button>
          </div>
          <div>
            <SessionStateWrapper
              Guest={(signIn) => <button onClick={signIn}>Sign in</button>}
              User={(sessionData, signOut) => (
                <div className="flex h-fit items-center gap-3 text-lg text-zinc-400">
                  <UserAccountMenu
                    image={sessionData.user.image ?? ""}
                    id={sessionData.user.id}
                    name={sessionData.user.name ?? ""}
                    role={sessionData.user.role}
                    signOut={signOut}
                  />
                  <button
                    onClick={handleNotificationsToggle}
                    className="relative"
                    ref={notificationBtnRef}
                  >
                    <Indicator
                      showIndicator={!!unseenNotificationsCounterQuery.data}
                      x="end"
                      y="top"
                      content={unseenNotificationsCounterQuery.data}
                    >
                      <BiBell />
                    </Indicator>
                    {notificationsOpen ? (
                      <NotificationsWrapper userId={sessionData.user.id} />
                    ) : null}
                  </button>
                  <button onClick={() => liveSearchOpenState[1](true)}>
                    <FiSearch />
                  </button>
                  <button onClick={toggleLayoutWidth}>
                    <AiOutlineColumnWidth />
                  </button>
                </div>
              )}
            />
          </div>
        </div>
        <div className="flex h-full w-full items-end pb-1 text-sm">
          {/* <div>A</div>
          <div>A</div>
          <div>A</div>
          <div>A</div>
          <div>A</div> */}
        </div>
      </div>
    </header>
  );
};

export default Header;

const UserAccountMenu: React.FC<{
  id: string;
  image: string;
  name: string;
  role: Role;
  signOut: () => Promise<void>;
}> = ({ id, image, name, role, signOut }) => {
  const paths = usePaths();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex h-fit w-fit justify-center rounded-md text-sm font-medium text-white">
          <UserAvatar src={image} alt="" height={30} width={30} />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-20 mt-2 w-56 origin-top-right divide-y divide-zinc-700 rounded-md bg-zinc-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              <div className="flex gap-3">
                <div className="h-fit w-fit items-start">
                  <UserAvatar src={image} alt="" height={40} width={40} />
                </div>
                <div>
                  <div className="text-white">{name}</div>
                  <div className={USER_ROLE_THINGS[role].textColor}>{role}</div>
                </div>
              </div>
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              <LinkButton href={paths.user(id)}>My profile</LinkButton>
            </Menu.Item>
          </div>

          <div className="px-1 py-1">
            <Menu.Item>
              <button
                className="group flex w-full items-center rounded-md px-2 py-2 text-sm text-white hover:text-red-900"
                onClick={() => void signOut()}
              >
                Log out
              </button>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const NotificationsView = () => {
  const notificationsQuery = api.notification.getAll.useQuery(undefined, {
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  const utils = api.useContext();

  useSubscribeToEvent("notification", () => {
    void utils.notification.countUnseen.invalidate();
    void notificationsQuery.refetch();
  });

  return (
    <div className="absolute top-6 right-0 max-h-[30vh] w-64 overflow-y-scroll overscroll-y-none rounded bg-zinc-800 p-2">
      <StateWrapper
        data={notificationsQuery.data}
        isLoading={notificationsQuery.isLoading}
        isError={notificationsQuery.isError}
        NonEmpty={(notifications) => (
          <div className="flex flex-col space-y-1">
            {notifications.map((notification) => (
              <div
                className="flex w-full flex-col items-start rounded-sm bg-zinc-900 p-1 text-start text-sm"
                key={notification.id}
              >
                <span className="font-semibold">{notification.title}</span>
                <span>{notification.content}</span>
              </div>
            ))}
          </div>
        )}
      />
    </div>
  );
};

const NotificationsWrapper: React.FC<{ userId: User["id"] }> = ({ userId }) => {
  return (
    <PusherProvider slug={`user-${userId}`}>
      <NotificationsView />
    </PusherProvider>
  );
};
