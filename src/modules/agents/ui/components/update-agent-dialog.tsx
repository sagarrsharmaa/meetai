import { ResponsiveDialog } from "@/components/responsive-dailog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface UpdateAgentDailogProps {
    open : boolean;
    onOpenChange: (open : boolean) => void;
    initialValues : AgentGetOne;
}; 

export const UpdateAgentDailog = ({ 
    open,
    onOpenChange,
    initialValues,
} : UpdateAgentDailogProps) => {
    return (
        <ResponsiveDialog
        title="Edit Agent"
        description="Edit the agent details"
        open = {open}
        onOpenChange={onOpenChange} 
        >
              <AgentForm 
               onSuccess={() => onOpenChange(false)}
               onCancle={() => onOpenChange(false)}
                initialValues = {initialValues}
              />
        </ResponsiveDialog>
    );
};