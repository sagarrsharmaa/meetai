import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

export type MeetingGetOne = inferRouterOutputs<AppRouter>["meetings"]["getOne"];
export type MeetingGetMany =
  inferRouterOutputs<AppRouter>["meetings"]["getMany"]["items"][number];

export enum MeetingStatus {
  Upcoming = "upcoming",
  Active = "active",
  Completed = "completed",
  Processing = "processing",
  Cancelled = "cancelled",
}

/** One line of a Stream transcription JSONL file. */
export type StreamTranscriptItem = {
  speaker_id: string;
  type: string;
  text: string;
  start_ts: number;
  stop_ts: number;
};
