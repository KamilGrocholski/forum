/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import PusherServer from "pusher";
import { env } from "../../env.mjs";

export const pusherServerClient = new PusherServer({
  appId: env.PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: env.PUSHER_APP_SECRET,
  host: env.NEXT_PUBLIC_PUSHER_SERVER_HOST,
  port: env.NEXT_PUBLIC_PUSHER_SERVER_PORT,
  useTLS: env.NEXT_PUBLIC_PUSHER_SERVER_TLS === "true",
  cluster: env.NEXT_PUBLIC_PUSHER_SERVER_CLUSTER,
});
