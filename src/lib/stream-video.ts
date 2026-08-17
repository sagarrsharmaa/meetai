import "server-only";

import { StreamClient } from "@stream-io/node-sdk";

let client: StreamClient | null = null;

export const isStreamVideoConfigured = () =>
  !!process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY &&
  !!process.env.STREAM_VIDEO_SECRET_KEY;

/**
 * Lazily created so the rest of the app keeps working when Stream credentials
 * are not set yet — only the call/webhook code paths need them.
 */
export const getStreamVideo = () => {
  if (!isStreamVideoConfigured()) {
    throw new Error(
      "Stream Video is not configured. Set NEXT_PUBLIC_STREAM_VIDEO_API_KEY and STREAM_VIDEO_SECRET_KEY.",
    );
  }

  client ??= new StreamClient(
    process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!,
    process.env.STREAM_VIDEO_SECRET_KEY!,
  );

  return client;
};
