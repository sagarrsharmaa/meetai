"use client"
import {Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { NewAgentDailog } from "./new-agent-dailog";
import { useState } from "react";


export const AgentsListHeader = () => {
    const [isDailogOpen , SetIsDailogOpen] = useState(false);
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
        </div>
        </>
    );
};