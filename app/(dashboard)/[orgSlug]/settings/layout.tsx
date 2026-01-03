"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsNav = [
  { name: "General", href: "" },
  { name: "Members", href: "/members" },
  { name: "Billing", href: "/billing" },
  { name: "Audit Log", href: "/audit-log" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const pathname = usePathname();
  const orgSlug = params.orgSlug as string;
  const basePath = `/${orgSlug}/settings`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization settings and preferences.
        </p>
      </div>

      <div className="flex gap-8">
        <nav className="w-48 flex-shrink-0">
          <ul className="space-y-1">
            {settingsNav.map((item) => {
              const href = `${basePath}${item.href}`;
              const isActive = pathname === href || 
                (item.href === "" && pathname === basePath);
              
              return (
                <li key={item.name}>
                  <Link
                    href={href}
                    className={cn(
                      "block px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
