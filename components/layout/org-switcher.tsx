"use client";

import * as React from "react";
import { ChevronsUpDown, Check, PlusIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { mockOrganizations, getCurrentOrganization } from "@/lib/mock-data";

export function OrgSwitcher() {
  const currentOrg = getCurrentOrganization();
  const organizations = mockOrganizations;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            {currentOrg.name.charAt(0)}
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{currentOrg.name}</span>
            <span className="truncate text-xs text-muted-foreground capitalize">
              {currentOrg.plan} plan
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Organizations
        </DropdownMenuLabel>
        {organizations.map((org) => (
          <DropdownMenuItem key={org._id} className="gap-2 p-2">
            <div className="flex size-6 items-center justify-center rounded-sm bg-primary text-primary-foreground text-xs font-semibold">
              {org.name.charAt(0)}
            </div>
            <span className="flex-1">{org.name}</span>
            {org._id === currentOrg._id && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 p-2">
          <div className="flex size-6 items-center justify-center rounded-md border border-dashed">
            <PlusIcon className="size-4" />
          </div>
          <span className="text-muted-foreground">Create organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
