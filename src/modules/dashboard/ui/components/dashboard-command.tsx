"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { GeneratedAvatar } from "@/components/generated-avatar";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const trpc = useTRPC();
  const meetings = useQuery(
    trpc.meetings.getMany.queryOptions({ search, pageSize: 100 }),
  );
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({ search, pageSize: 100 }),
  );

  const onSelect = (href: string) => {
    router.push(href);
    setOpen(false);
    setSearch("");
  };

  return (
    <CommandResponsiveDialog
      shouldFilter={false}
      open={open}
      onOpenChange={setOpen}
    >
      <CommandInput
        placeholder="Find a meeting or agent"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandGroup heading="Meetings">
          <CommandEmpty>
            <span className="text-sm text-muted-foreground">
              No meetings found
            </span>
          </CommandEmpty>
          {(meetings.data?.items ?? []).map((meeting) => (
            <CommandItem
              key={meeting.id}
              onSelect={() => onSelect(`/meetings/${meeting.id}`)}
            >
              {meeting.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Agents">
          <CommandEmpty>
            <span className="text-sm text-muted-foreground">
              No agents found
            </span>
          </CommandEmpty>
          {(agents.data?.items ?? []).map((agent) => (
            <CommandItem
              key={agent.id}
              onSelect={() => onSelect(`/agents/${agent.id}`)}
            >
              <GeneratedAvatar
                seed={agent.name}
                variant="botttsNeutral"
                className="size-5"
              />
              {agent.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
