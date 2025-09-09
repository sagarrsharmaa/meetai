// import { CommandDialog, CommandInput , CommandList , CommandItem} from "@/components/ui/command";
// import { Dispatch, SetStateAction } from "react";


// interface Props {
//      open : boolean;
//      setOpen: Dispatch<SetStateAction<boolean>>;
// }    

// export const DashboardCommand = ({open , setOpen}: Props) => {
//     return(
//         <CommandDialog open={open} onOpenChange={setOpen}>
//             <CommandInput 
//             placeholder="Find a meeting or agent"
//             />
//             <CommandList>
//                 <CommandItem>
//                     Test
//                 </CommandItem>
//             </CommandList>
//         </CommandDialog>
//     )
// }
import { CommandResponsiveDialog, CommandInput , CommandList , CommandItem} from "@/components/ui/command";
import { Dispatch, SetStateAction } from "react";


interface Props {
     open : boolean;
     setOpen: Dispatch<SetStateAction<boolean>>;
}    

export const DashboardCommand = ({open , setOpen}: Props) => {
    return(
        <CommandResponsiveDialog
            open={open} 
            onOpenChange={setOpen}
            className="bg-white/20 backdrop-blur-sm"
        >
            <CommandInput 
                placeholder="Find a meeting or agent"
            />
            <CommandList>
                <CommandItem>
                    Test
                </CommandItem>
            </CommandList>
        </CommandResponsiveDialog>
    )
}