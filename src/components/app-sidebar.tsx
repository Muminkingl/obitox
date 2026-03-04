"use client"

import * as React from "react"
import {
  IconBell,
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconKey,
  IconListDetails,
  IconReport,
  IconSearch,
  IconCreditCard,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import UserProfile from "@/components/user-profile"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useUnreadAuditCount } from "@/hooks/useUnreadAuditCount"
import { useAppearance } from "@/contexts/appearance-context"
import { cn } from "@/lib/utils"

const data = {
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { count } = useUnreadAuditCount();
  const { transparentSidebar, isLoaded } = useAppearance();

  // Red dot badge for unread notifications
  const RedDotBadge = count > 0 ? (
    <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border border-white dark:border-zinc-900" />
  ) : null;

  const documents = [
    {
      name: "Usage",
      url: "/dashboard/usage",
      icon: IconChartBar,
    },
    {
      name: "API Keys",
      url: "/dashboard/api",
      icon: IconKey,
    },
    {
      name: "Logs",
      url: "/dashboard/audit",
      icon: IconFileDescription,
    },


  ];

  return (
    <Sidebar
      collapsible="offcanvas"
      {...props}
      className={cn(
        "transition-colors duration-300",
        isLoaded && transparentSidebar && "bg-transparent backdrop-blur-xl border-r border-border/50"
      )}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="/obitoX.png" alt="ObitoX" className="!size-7" />
                <span className="text-base font-semibold">ObitoX</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavDocuments items={documents} />
      </SidebarContent>
      <SidebarFooter>
        <UserProfile />
      </SidebarFooter>
    </Sidebar>
  )
}