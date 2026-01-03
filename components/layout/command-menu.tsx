"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  GitBranch,
  Play,
  Bell,
  Link2,
  Key,
  Settings,
  Users,
  CreditCard,
  FileText,
  Moon,
  Sun,
  Plus,
} from "lucide-react";
import { useTheme } from "next-themes";

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const { setTheme } = useTheme();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp"))}
          >
            <Home className="mr-2 size-4" />
            <span>Overview</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/workflows"))}
          >
            <GitBranch className="mr-2 size-4" />
            <span>Workflows</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/runs"))}
          >
            <Play className="mr-2 size-4" />
            <span>Runs</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/events"))}
          >
            <Bell className="mr-2 size-4" />
            <span>Events</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/integrations"))}
          >
            <Link2 className="mr-2 size-4" />
            <span>Integrations</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/api-keys"))}
          >
            <Key className="mr-2 size-4" />
            <span>API Keys</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/settings"))}
          >
            <Settings className="mr-2 size-4" />
            <span>General Settings</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/settings/members"))}
          >
            <Users className="mr-2 size-4" />
            <span>Team Members</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/settings/billing"))}
          >
            <CreditCard className="mr-2 size-4" />
            <span>Billing</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/settings/audit-log"))}
          >
            <FileText className="mr-2 size-4" />
            <span>Audit Log</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem
            onSelect={() => runCommand(() => router.push("/acme-corp/workflows/new"))}
          >
            <Plus className="mr-2 size-4" />
            <span>Create Workflow</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Theme">
          <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
            <Sun className="mr-2 size-4" />
            <span>Light Mode</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
            <Moon className="mr-2 size-4" />
            <span>Dark Mode</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
