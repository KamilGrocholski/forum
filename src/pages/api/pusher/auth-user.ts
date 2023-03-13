import type { NextApiRequest, NextApiResponse } from "next";
import { pusherServerClient } from "../../../server/utils/pusher";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const socket_id = req.body.socket_id as string;
  const { user_id } = req.headers;

  if (!user_id || typeof user_id !== "string") {
    res.status(404).send("lol");
    return;
  }
  const auth = pusherServerClient.authenticateUser(socket_id, {
    id: user_id,
    name: "legal-valley-545",
  });
  res.send(auth);
}
