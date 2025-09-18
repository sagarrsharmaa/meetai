"use client"
import {Button } from "@/components/ui/button";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { NewAgentDailog } from "./new-agent-dailog";
import { useState } from "react";
import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { AgentsSearchFilters } from "./agents-search-filter";
import { DEFAULT_PAGE } from "@/constants";

export const AgentsListHeader = () => {
    const [filters , setFilters] = useAgentsFilters();
    const [isDailogOpen , SetIsDailogOpen] = useState(false);

    const isAnyFilterModified = !!filters.search;
    
    const onClearFilters = () => {
        setFilters({
            search: '',
            page : DEFAULT_PAGE,
        });
    }

    return (
        <>
        <NewAgentDailog open={isDailogOpen} onOpenChange = {SetIsDailogOpen}/>
        <div className="py-4 px-4 md:px-8 flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h5 className="font-medium text-xl">My Agents</h5>

                <Button
                onClick={() => SetIsDailogOpen(true)}
                 className="bg-[#2d5a2d] text-white hover:bg-[#16a34a] border-[#5D6B68]/10">
                <PlusIcon />
                    New Agent
                </Button>
            </div>
            <div className="flex items-center gap-x-2 p-1">
                <AgentsSearchFilters />

                {isAnyFilterModified && (
                  <Button variant="outline" size="sm"  onClick={onClearFilters}>
                    <XCircleIcon/>
                    clear
                 </Button>
                )}
            </div>
        </div>
        </>
    );
};