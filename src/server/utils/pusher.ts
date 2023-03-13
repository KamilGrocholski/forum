import PusherServer from "pusher";
import { env } from "../../env.mjs";

export const pusherServerClient = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER,
  useTLS: env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true",
});
