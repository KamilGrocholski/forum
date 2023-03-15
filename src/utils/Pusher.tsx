import type { Channel, PresenceChannel } from "pusher-js";
import type { StoreApi } from "zustand/vanilla";
import type { PropsWithChildren } from "react";

import { useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
// import { atom } from 'jotai'
import createContext from "zustand/context";
import { env } from "../env.mjs";
import vanillaCreate from "zustand/vanilla";

type PusherZustandStore = {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, unknown>;
};

const createPusherStore = (slug: string) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher;
    pusherClient.connect();
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    pusherClient = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER,
      authEndpoint: "/api/pusher/auth-channel",
      auth: {
        headers: { user_id: randomUserId },
      },
    });
  }

  const channel = pusherClient.subscribe(slug);

  const presenceChannel = pusherClient.subscribe(
    `presence-${slug}`
  ) as PresenceChannel;

  const store = vanillaCreate<PusherZustandStore>(() => {
    return {
      pusherClient,
      channel,
      presenceChannel,
      members: new Map(),
    };
  });

  const updateMembers = () => {
    store.setState(() => ({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      members: new Map(Object.entries(presenceChannel.members.members)),
    }));
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
};

const {
  Provider: PusherZustandStoreProvider,
  useStore: usePusherZustandStore,
} = createContext<StoreApi<PusherZustandStore>>();

export const PusherProvider = ({
  slug,
  children,
}: PropsWithChildren<{ slug: string }>) => {
  const [store, setStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(slug);
    setStore(newStore);
    return () => {
      const pusher = newStore.getState().pusherClient;
      pusher.disconnect();
      newStore.destroy();
    };
  }, [slug]);

  if (!store) return null;

  return (
    <PusherZustandStoreProvider createStore={() => store}>
      {children}
    </PusherZustandStoreProvider>
  );
};

export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const channel = usePusherZustandStore((state) => state.channel);

  const stableCallback = useRef(callback);

  // Keep callback sync'd
  useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}

export const useCurrentMemberCount = () =>
  usePusherZustandStore((s) => s.members.size);
