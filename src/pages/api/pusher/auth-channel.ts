import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServerClient } from "../../../server/utils/pusher";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const channel_name = req.body.channel_name as string;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const socket_id = req.body.socket_id as string;
  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== "string") {
    res.status(404).send("lol");
    return;
  }
  const auth = pusherServerClient.authorizeChannel(socket_id, channel_name, {
    user_id,
    user_info: {
      name: "superman",
    },
  });
  res.send(auth);
}
