"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Building2,
  CalendarCheck,
  FileText,
  FolderArchive,
  BarChart3,
  UserCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Flame,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSalesStore } from "@/context/sales-store";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const { stats } = useSalesStore();

  const mainNavigation: NavItem[] = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    {
      name: "Leads",
      href: "/leads",
      icon: Users,
      badge: stats.activeLeadsCount,
      badgeVariant: "info",
    },
    { name: "Deals", href: "/deals", icon: Briefcase },
    { name: "Customers", href: "/customers", icon: Building2, badge: stats.totalCustomersCount },
    {
      name: "Follow-ups",
      href: "/follow-ups",
      icon: CalendarCheck,
      badge: stats.pendingFollowUpsCount > 0 ? stats.pendingFollowUpsCount : undefined,
      badgeVariant: "warning",
    },
  ];

  const collateralNavigation: NavItem[] = [
    { name: "Proposals", href: "/proposals", icon: FileText },
    { name: "Sales Resources", href: "/resources", icon: FolderArchive },
    { name: "Sales Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const manageNavigation: NavItem[] = [
    { name: "Team", href: "/team", icon: UserCheck },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const renderNavLink = (item: NavItem) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    const linkContent = (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all group relative",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
            : "text-muted-foreground hover:bg-accent hover:text-foreground",
          isCollapsed && "justify-center px-2"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 shrink-0 transition-transform group-hover:scale-110",
            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
          )}
        />
        {!isCollapsed && (
          <>
            <span className="truncate flex-1">{item.name}</span>
            {item.badge !== undefined && (
              <Badge
                variant={isActive ? "secondary" : item.badgeVariant || "secondary"}
                className={cn("ml-auto text-[11px] px-1.5 py-0 h-4 min-w-4 flex items-center justify-center")}
              >
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Link>
    );

    if (isCollapsed) {
      return (
        <TooltipProvider key={item.name} delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.name}</span>
              {item.badge !== undefined && (
                <Badge variant={item.badgeVariant || "secondary"} className="text-[10px] px-1 py-0">
                  {item.badge}
                </Badge>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return <div key={item.name}>{linkContent}</div>;
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r border-border bg-card/60 backdrop-blur-md transition-all duration-300 select-none relative z-30",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-md shadow-primary/25">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                SalesToolkit
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  Pro
                </span>
              </span>
              <span className="text-[11px] text-muted-foreground">Internal Revenue Hub</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-400 flex items-center justify-center text-white shadow-md shadow-primary/25">
              <Flame className="h-5 w-5 fill-current" />
            </div>
          </div>
        )}
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Core CRM
            </p>
          )}
          <nav className="space-y-1">{mainNavigation.map(renderNavLink)}</nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Collateral & Pipeline
            </p>
          )}
          <nav className="space-y-1">{collateralNavigation.map(renderNavLink)}</nav>
        </div>

        <div>
          {!isCollapsed && (
            <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
              Administration
            </p>
          )}
          <nav className="space-y-1">{manageNavigation.map(renderNavLink)}</nav>
        </div>
      </div>

      {/* Target Progress Banner (when not collapsed) */}
      {!isCollapsed && (
        <div className="p-3 m-3 rounded-xl border border-primary/20 bg-primary/5 text-xs">
          <div className="flex items-center justify-between font-semibold text-foreground mb-1">
            <span>Quarterly Quota</span>
            <span className="text-primary">117%</span>
          </div>
          <div className="w-full bg-primary/20 h-1.5 rounded-full overflow-hidden mb-2">
            <div className="bg-primary h-full rounded-full" style={{ width: "100%" }} />
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Team is $1.41M / $1.2M on track. 14 days left in Q1.
          </p>
        </div>
      )}

      {/* Footer / Toggle Button */}
      <div className="p-3 border-t border-border flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 pl-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Internal Sync Active</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("h-8 w-8 text-muted-foreground hover:text-foreground", isCollapsed && "mx-auto")}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
}
