import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";   
interface Props {
    children: React.ReactNode;
}


import { Children } from "react"

const Layout = ({children}: Props ) => {
    return(
        <SidebarProvider>
            <DashboardSidebar  />
            <main className="flex flex-col h-screen w-screen bg-gray-100">
             <DashboardNavbar />
            {children}
            </main>
        </SidebarProvider>
    )
}
export default Layout;
