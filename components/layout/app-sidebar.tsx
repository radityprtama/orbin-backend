"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  GitBranch,
  Play,
  Bell,
  Link2,
  Key,
  Settings,
  HelpCircle,
  FileText,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { OrgSwitcher } from "./org-switcher";
import { UserNav } from "./user-nav";

const mainNavItems = [
  { title: "Overview", href: "", icon: Home },
  { title: "Workflows", href: "/workflows", icon: GitBranch },
  { title: "Runs", href: "/runs", icon: Play },
  { title: "Events", href: "/events", icon: Bell },
  { title: "Integrations", href: "/integrations", icon: Link2 },
  { title: "API Keys", href: "/api-keys", icon: Key },
];

const secondaryNavItems = [
  { title: "Settings", href: "/settings", icon: Settings },
  { title: "Documentation", href: "https://docs.orbin.dev", icon: FileText, external: true },
  { title: "Help", href: "https://orbin.dev/support", icon: HelpCircle, external: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const orgSlug = segments[0] || "acme-corp";

  const isActive = (href: string) => {
    const fullPath = `/${orgSlug}${href}`;
    if (href === "") {
      return pathname === `/${orgSlug}` || pathname === `/${orgSlug}/`;
    }
    return pathname.startsWith(fullPath);
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <OrgSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    <Link href={`/${orgSlug}${item.href}`}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.href)}>
                    {item.external ? (
                      <a href={item.href} target="_blank" rel="noopener noreferrer">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </a>
                    ) : (
                      <Link href={`/${orgSlug}${item.href}`}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
