import "server-only";

import { StreamChat } from "stream-chat";

let client: StreamChat | null = null;

export const isStreamChatConfigured = () =>
  !!process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY &&
  !!process.env.STREAM_CHAT_SECRET_KEY;

export const getStreamChat = () => {
  if (!isStreamChatConfigured()) {
    throw new Error(
      "Stream Chat is not configured. Set NEXT_PUBLIC_STREAM_CHAT_API_KEY and STREAM_CHAT_SECRET_KEY.",
    );
  }

  client ??= StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_CHAT_API_KEY!,
    process.env.STREAM_CHAT_SECRET_KEY!,
  );

  return client;
};
