import { useTRPC } from "@/trpc/client";
import { AgentGetOne } from "../../types";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

 import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField ,
} from "@/components/ui/form";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useForm } from "react-hook-form";
import {z} from "zod";
import { agentsInsertSchema } from "../../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

interface AgentFormProps {
    onSuccess ?: () => void;
    onCancle ?: () => void;
    initialValues?: AgentGetOne;
};

export const AgentForm = ({
onSuccess,
onCancle,
initialValues


}: AgentFormProps) => {
    const trpc = useTRPC();
    const router = useRouter();
    const queryClient = useQueryClient();


    const createAgent = useMutation(
       trpc.agents.create.mutationOptions({
            onSuccess: () => {
                queryClient.invalidateQueries(
                    trpc.agents.getMany.queryOptions(),
                );
                if(initialValues ?.id) {
                    queryClient.invalidateQueries(
                        trpc.agents.getOne.queryOptions({id : initialValues.id}),
                    );
                } 
                onSuccess?.();                
            },
            onError: (error) => {
                toast.error(error.message);
                //TODO : CHECK IF ERROR CODE IS "FORBIDDEN" , REDIRECT TO /UPDATE
                
            },
        }), 
    );
     
     const form =  useForm<z.infer<typeof agentsInsertSchema>>({
        resolver : zodResolver(agentsInsertSchema),
        defaultValues : {
            name: initialValues?.name?? "",
            instructions: initialValues?.instructions?? "",

        },
     });
           
    const isEdit = !!initialValues?.id;
    const isPending = createAgent.isPending;
      
    const onSubmit = (values : z.infer<typeof agentsInsertSchema>) => {
        if(isEdit){
            console.log("TODO : UpdateAgent")
        } else {
            createAgent.mutate(values);
        }
    }; 
      
     return (
        <Form {...form}>
            <form className="space-y-4" onSubmit = {form.handleSubmit(onSubmit)}>
                <GeneratedAvatar 
                 seed = {form.watch("name")}
                 variant = "botttsNeutral"
                 className="border size-16"
                /> 
                 
           <FormField
            name = "name"
             control = {form.control}
             render = {({ field }) => (
                <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                    <Input {...field}  placeholder="e.g. Your Virtual Daddy"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
             )}
          />
            
             <FormField
            name = "instructions"
             control = {form.control}
             render = {({ field }) => (
                <FormItem>
                    <FormLabel>Instructions</FormLabel>
                    <FormControl>
                        <Textarea {...field}  placeholder="this is your virtual daddy that can remove your loneliness"/>
                    </FormControl>
                    <FormMessage />
                </FormItem>
             )}
          /> 
           <div className="flex justify-between gapx-2">
            {onCancle && (
                <Button
                variant="ghost"
                disabled = {isPending}
                type="button"
                onClick={() => onCancle()}
                >
                    cancle
                </Button>
            )}
            <Button disabled={isPending} type="submit">
                {isEdit ? "update" : "create"}
            </Button>
           </div>      
         </form>
        </Form>
     )   
}