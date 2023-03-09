import Pusher, { type Channel, type PresenceChannel } from "pusher-js";
import vanillaCreate, { type StoreApi } from "zustand/vanilla";
import { env } from "../env.mjs";

const pusher_key = env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusher_server_host = env.NEXT_PUBLIC_PUSHER_SERVER_HOST;
const pusher_server_port = parseInt(env.NEXT_PUBLIC_PUSHER_SERVER_PORT, 10);
const pusher_server_tls = env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true";
const pusher_server_cluster = env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER;

interface PusherZustandStore {
  pusherClient: Pusher;
  channel: Channel;
  presenceChannel: PresenceChannel;
  members: Map<string, unknown>;
}

const createPusherStore = (slug: string) => {
  let pusherClient: Pusher;
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher;
    pusherClient.connect();
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`;
    pusherClient = new Pusher(pusher_key, {
      wsHost: pusher_server_host,
      wsPort: pusher_server_port,
      enabledTransports: pusher_server_tls ? ["ws", "wss"] : ["ws"],
      forceTLS: pusher_server_tls,
      cluster: pusher_server_cluster,
      disableStats: true,
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
      pusherClient: pusherClient,
      channel: channel,
      presenceChannel,
      members: new Map(),
    };
  });

  const updateMembers = () => {
    store.setState(() => ({
      members: new Map(
        Object.entries(presenceChannel.members.members as { name: string })
      ),
    }));
  };

  presenceChannel.bind("pusher:subscription_succeeded", updateMembers);
  presenceChannel.bind("pusher:member_added", updateMembers);
  presenceChannel.bind("pusher:member_removed", updateMembers);

  return store;
};

import createContext from "zustand/context";
const {
  Provider: PusherZustandStoreProvider,
  useStore: usePusherZustandStore,
} = createContext<StoreApi<PusherZustandStore>>();

import React, { useEffect, useState } from "react";

export const PusherProvider: React.FC<
  React.PropsWithChildren<{ slug: string }>
> = ({ slug, children }) => {
  const [store, updateStore] = useState<ReturnType<typeof createPusherStore>>();

  useEffect(() => {
    const newStore = createPusherStore(slug);
    updateStore(newStore);
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

  const stableCallback = React.useRef(callback);

  React.useEffect(() => {
    stableCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data);
    };
    channel.bind(eventName, reference);
    return () => {
      channel.unbind(eventName, reference);
    };
  }, [channel, eventName]);
}
