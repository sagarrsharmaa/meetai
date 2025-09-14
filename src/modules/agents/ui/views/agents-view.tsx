

"use client"

import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery } from "@tanstack/react-query"
import { ErrorState } from "@/components/error-state"
import { DataTable } from "../components/data-table"; 
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";

export const AgentsView = () => {
    const trpc = useTRPC();
    const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col">
            <DataTable data={data} columns={columns} />
            {data.length === 0 && (
                <EmptyState 
                title="Create Your First Agent"
                description="Create an agent to join your meetings. Each agent
                will follow you instructions and can interact with participants during call."
                

                />
            )}
        </div>
    );
};

export const AgentsViewLoading = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few seconds"
        />
    );
};

export const AgentsViewError = () => {
    return (
        <ErrorState 
            title="Error loading Agents"
            description="Something went wrong"
        />
    );
};