"use client";

import Link from "next/link";
import { useState } from "react";
import { format } from "date-fns";
import { BotIcon, PlusIcon, VideoIcon } from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { NewAgentDialog } from "@/modules/agents/ui/components/new-agent-dialog";
import { NewMeetingDialog } from "@/modules/meetings/ui/components/new-meeting-dialog";

export const HomeView = () => {
  const trpc = useTRPC();

  const [newMeetingOpen, setNewMeetingOpen] = useState(false);
  const [newAgentOpen, setNewAgentOpen] = useState(false);

  const { data: meetings } = useSuspenseQuery(
    trpc.meetings.getMany.queryOptions({ pageSize: 5 }),
  );
  const { data: agents } = useSuspenseQuery(
    trpc.agents.getMany.queryOptions({ pageSize: 5 }),
  );

  return (
    <>
      <NewMeetingDialog
        open={newMeetingOpen}
        onOpenChange={setNewMeetingOpen}
      />
      <NewAgentDialog open={newAgentOpen} onOpenChange={setNewAgentOpen} />

      <div className="flex flex-1 flex-col gap-y-6 px-4 py-4 md:px-8">
        <div className="flex flex-col gap-y-2">
          <h4 className="text-2xl font-medium">Welcome back</h4>
          <p className="text-sm text-muted-foreground">
            Create an agent, start a meeting, and get an AI summary when it ends.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-y-4 rounded-lg border bg-white p-6">
            <div className="flex items-center gap-x-2">
              <VideoIcon className="size-5 text-muted-foreground" />
              <p className="font-medium">Meetings</p>
              <Badge variant="outline" className="ml-auto">
                {meetings.total}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Start a call with one of your agents. Transcript, recording and
              summary are generated automatically.
            </p>
            <div className="flex items-center gap-x-2">
              <Button onClick={() => setNewMeetingOpen(true)}>
                <PlusIcon />
                New Meeting
              </Button>
              <Button variant="outline" asChild>
                <Link href="/meetings">View all</Link>
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 rounded-lg border bg-white p-6">
            <div className="flex items-center gap-x-2">
              <BotIcon className="size-5 text-muted-foreground" />
              <p className="font-medium">Agents</p>
              <Badge variant="outline" className="ml-auto">
                {agents.total}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Agents join your calls with the instructions you give them and can
              answer questions afterwards.
            </p>
            <div className="flex items-center gap-x-2">
              <Button onClick={() => setNewAgentOpen(true)}>
                <PlusIcon />
                New Agent
              </Button>
              <Button variant="outline" asChild>
                <Link href="/agents">View all</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 rounded-lg border bg-white p-6">
          <p className="font-medium">Recent meetings</p>
          {meetings.items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No meetings yet — create your first one above.
            </p>
          ) : (
            <div className="flex flex-col divide-y">
              {meetings.items.map((meeting) => (
                <Link
                  key={meeting.id}
                  href={`/meetings/${meeting.id}`}
                  className="flex items-center gap-x-3 py-3 hover:bg-muted/50"
                >
                  <GeneratedAvatar
                    seed={meeting.agent.name}
                    variant="botttsNeutral"
                    className="size-8"
                  />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate font-medium capitalize">
                      {meeting.name}
                    </span>
                    <span className="truncate text-xs text-muted-foreground capitalize">
                      {meeting.agent.name} ·{" "}
                      {format(meeting.createdAt, "MMM d, yyyy")}
                    </span>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {meeting.status}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const HomeViewLoading = () => (
  <LoadingState
    title="Loading dashboard"
    description="This may take a few seconds"
  />
);

export const HomeViewError = () => (
  <ErrorState
    title="Error loading dashboard"
    description="Something went wrong"
  />
);
