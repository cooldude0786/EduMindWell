import { getServerSession } from "next-auth"

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <SidebarProvider>
      <DashboardSidebar user={session?.user} />
      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <SidebarTrigger aria-label="Toggle dashboard navigation" />
          <div className="h-5 w-px bg-border" />
          <div>
            <p className="text-sm font-semibold">Admin Dashboard</p>
            <p className="hidden text-xs text-muted-foreground sm:block">
              Manage EduMindWell content and operations
            </p>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
