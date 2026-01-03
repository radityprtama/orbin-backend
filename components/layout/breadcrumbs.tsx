"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const routeLabels: Record<string, string> = {
  workflows: "Workflows",
  runs: "Runs",
  events: "Events",
  integrations: "Integrations",
  "api-keys": "API Keys",
  settings: "Settings",
  members: "Members",
  billing: "Billing",
  "audit-log": "Audit Log",
  new: "New",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  
  if (segments.length === 0) return null;
  
  const orgSlug = segments[0];
  const items: { label: string; href?: string }[] = [
    { label: orgSlug, href: `/${orgSlug}` },
  ];
  
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const label = routeLabels[segment] || segment;
    const isLast = i === segments.length - 1;
    const href = isLast ? undefined : `/${segments.slice(0, i + 1).join("/")}`;
    items.push({ label, href });
  }

  return (
    <nav className="flex items-center text-sm text-muted-foreground">
      {items.map((item, index) => (
        <Fragment key={index}>
          {index > 0 && <ChevronRight className="mx-2 size-4" />}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium">{item.label}</span>
          )}
        </Fragment>
      ))}
    </nav>
  );
}
