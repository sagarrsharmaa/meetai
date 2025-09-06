// "use-client";


// import{
// Sidebar,
// SidebarContent,
//  SidebarFooter, 
// SidebarHeader,
// SidebarGroup,
// SidebarGroupContent,
// SidebarMenu,
// SidebarMenuItem,
// SidebarMenuButton
// } from "@/components/ui/sidebar";
// import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { Separator } from "@/components/ui/separator";

// const firstSecition = [
//     {
//       icon: VideoIcon,
//       label: "Meetings",
//       href: "/meetings",
//   },
//   {
//     icon: BotIcon,
//     label: "Agents",
//     href: "/agents",
//   },
// ];

// const secondSecition = [
//     {
//       icon: StarIcon,
//       label: "Upgrade",
//       href: "/upgrade",
//   },
// ];

// export const DashboardSidebar = () => {
//     return(
//     <Sidebar>
//         <SidebarHeader className="text-sidebar-accent-foreground">
//             <Link href="/" className="flex items-center gap-2 px-2 pt-2">
//             <Image src="/logo.svg" width={36} height={36} alt="Meet.AI" />
//             <p className="text-2xl font-semibold">Meet.AI</p>
//             </Link>
//         </SidebarHeader>
//         <div className="px-4 py-2">
//          <Separator className="opacity-10 text-[#5D6B68]" />
//          <SidebarContent>
//             <SidebarGroup>
//                 <SidebarGroupContent>
//                     <SidebarMenu>
//                         {firstSecition.map((item) => (
//                             <SidebarMenuItem key={item.href}>
//                                 <SidebarMenuButton>
//                                     <Link href={item.href}>
//                                     <item.icon className="h-5 w-5" />
//                                     <span className="text-sm font-medium tracking-tight">
//                                         {item.label}
//                                     </span>
//                                     </Link>
            
//                                 </SidebarMenuButton>
//                             </SidebarMenuItem>
//                         ))}
//                     </SidebarMenu>
//                 </SidebarGroupContent>
//             </SidebarGroup>
//          </SidebarContent>
//         </div>
//     </Sidebar>

//     )
// };



"use client";

import{
Sidebar,
SidebarContent,
 SidebarFooter, 
SidebarHeader,
SidebarGroup,
SidebarGroupContent,
SidebarMenu,
SidebarMenuItem,
SidebarMenuButton
} from "@/components/ui/sidebar";
import{
   Drawer,
   DrawerContent,
   DrawerDescription,
   DrawerFooter,
   DrawerTitle,
   DrawerHeader,
   DrawerTrigger
} from "@/components/ui/drawer"
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";
import { BotIcon, StarIcon, VideoIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { use } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const firstSecition = [
    {
      icon: VideoIcon,
      label: "Meetings",
      href: "/meetings",
  },
  {
    icon: BotIcon,
    label: "Agents",
    href: "/agents",
  },
];

const secondSecition = [
    {
      icon: StarIcon,
      label: "Upgrade",
      href: "/upgrade",
  },
];

export const DashboardSidebar = () => {
 
    const pathname = usePathname();

    return(
    <Sidebar className="bg-[#1a2e1a] border-r border-[#2d5a2d]">
        <SidebarHeader className="text-white">
            <Link href="/" className="flex items-center gap-2 px-2 pt-2 text-white hover:text-[#22c55e]">
            <Image src="/logo.svg" width={36} height={36} alt="Meet.AI" />
            <p className="text-2xl font-semibold">Meet.AI</p>
            </Link>
        </SidebarHeader>
        <div className="px-4 py-2">
         <Separator className="opacity-80 bg-[#2d5a2d]" />
         </div>
         <SidebarContent>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {firstSecition.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                 asChild
                                 className= {cn("text-white hover:bg-[#16a34a]" ,
                                 pathname === item.href && " bg-[#2d5a2d] text-white hover:bg-[#16a34a] border-[#5D6B68]/10 "
                                 )}
                                 isActive={pathname === item.href}
                                 >
                                    <Link href={item.href} className="flex items-center gap-2">
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-sm font-medium tracking-tight">
                                        {item.label}
                                    </span>
                                    </Link>
            
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
            <div className="px-4 py-2">
         <Separator className="opacity-80 bg-[#2d5a2d]" />
            </div>
            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        {secondSecition.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                 asChild
                                 className= {cn("text-white hover:bg-[#16a34a]" ,
                                 pathname === item.href && " bg-[#2d5a2d] text-white hover:bg-[#16a34a] border-[#5D6B68]/10 "
                                 )}
                                 isActive={pathname === item.href}
                                 >
                                    <Link href={item.href} className="flex items-center gap-2">
                                    <item.icon className="h-5 w-5" />
                                    <span className="text-sm font-medium tracking-tight">
                                        {item.label}
                                    </span>
                                    </Link>
            
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
         </SidebarContent>
          
          <SidebarFooter className="text-white p-4">
            <DashboardUserButton />        
          </SidebarFooter>


    </Sidebar>

    )
};