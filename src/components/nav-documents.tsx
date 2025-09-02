"use client"

import { usePathname } from 'next/navigation';
import {
  IconFolder,
  IconShare3,
  IconTrash,
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils";

export function NavDocuments({
  items,
}: {
  items: {
    name: string
    url: string
    icon: Icon
  }[]
}) {
  const { isMobile } = useSidebar()
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {items.map((item) => {
          // Check if the current URL path starts with this item's URL path
          const isActive = pathname.startsWith(item.url);
          
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton 
                asChild 
                size="lg" 
                className={cn(
                  isActive && "bg-primary/10 font-medium text-primary"
                )}
              >
                <a href={item.url}>
                  <item.icon className={cn(
                    isActive && "text-primary"
                  )} />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
