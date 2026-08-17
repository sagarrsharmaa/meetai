import JSONL from "jsonl-parse-stringify";
import { eq, inArray } from "drizzle-orm";
import { createAgent, openai, type TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { agents, meetings, user } from "@/db/schema";
import type { StreamTranscriptItem } from "@/modules/meetings/types";

import { inngest } from "./client";

const summarizer = createAgent({
  name: "summarizer",
  system: `
You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of what was built, discussed, or demonstrated.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet form.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
  `.trim(),
  model: openai({
    model: "gpt-4o",
    apiKey: process.env.OPENAI_API_KEY,
  }),
});

type MeetingsProcessingEventData = {
  meetingId: string;
  transcriptUrl: string;
};

export const meetingsProcessing = inngest.createFunction(
  {
    id: "meetings/processing",
    triggers: [{ event: "meetings/processing" }],
  },
  async ({ event, step }) => {
    const { meetingId, transcriptUrl } = event.data as MeetingsProcessingEventData;

    const response = await step.run("fetch-transcript", async () => {
      return fetch(transcriptUrl).then((res) => res.text());
    });

    const transcript: StreamTranscriptItem[] = await step.run(
      "parse-transcript",
      async () => JSONL.parse<StreamTranscriptItem>(response),
    );

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ].filter(Boolean);

      if (speakerIds.length === 0) {
        return transcript.map((item) => ({
          ...item,
          user: { name: "Unknown" },
        }));
      }

      const userSpeakers = await db
        .select({ id: user.id, name: user.name })
        .from(user)
        .where(inArray(user.id, speakerIds));

      const agentSpeakers = await db
        .select({ id: agents.id, name: agents.name })
        .from(agents)
        .where(inArray(agents.id, speakerIds));

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find((s) => s.id === item.speaker_id);

        return {
          ...item,
          user: { name: speaker?.name ?? "Unknown" },
        };
      });
    });

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers),
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, meetingId));
    });
  },
);
