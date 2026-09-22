"use client";

import React, { useState } from "react";
import {
  Search,
  Bell,
  Plus,
  Menu,
  CheckCircle2,
  Calendar,
  DollarSign,
  User,
  Shield,
  LogOut,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { CommandPalette } from "./command-palette";
import { QuickAddDialog } from "./quick-add-dialog";
import { useSalesStore } from "@/context/sales-store";

export function Navbar({ onOpenMobileMenu }: { onOpenMobileMenu?: () => void }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddTab, setQuickAddTab] = useState<"lead" | "deal">("lead");
  const { followUps, deals, backendStatus } = useSalesStore();

  const urgentFollowUps = followUps.filter((f) => !f.completed && f.priority === "High");

  return (
    <>
      <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-20">
        {/* Left: Mobile trigger & Search bar */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          {onOpenMobileMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-muted-foreground"
              onClick={onOpenMobileMenu}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}

          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 w-full max-w-sm h-9 px-3 rounded-lg border border-border bg-background/80 hover:bg-accent text-muted-foreground hover:text-foreground text-xs transition-colors text-left select-none cursor-pointer"
          >
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="flex-1 truncate">Search leads, deals, resources...</span>
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Backend Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border border-border bg-muted/30">
            <span
              className={`h-2 w-2 rounded-full ${
                backendStatus === "connected"
                  ? "bg-emerald-500 animate-pulse"
                  : backendStatus === "checking"
                  ? "bg-amber-500"
                  : "bg-red-500"
              }`}
            />
            <span className="text-muted-foreground font-medium">
              {backendStatus === "connected"
                ? "API Connected"
                : backendStatus === "checking"
                ? "Checking API..."
                : "API Offline"}
            </span>
          </div>

          {/* Quick Create Action */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="gap-1.5 shadow-sm font-medium">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">New Action</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setQuickAddTab("lead");
                  setIsQuickAddOpen(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2 text-primary" />
                Add New Lead
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setQuickAddTab("deal");
                  setIsQuickAddOpen(true);
                }}
              >
                <DollarSign className="h-4 w-4 mr-2 text-emerald-500" />
                Create New Deal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground rounded-lg">
                <Bell className="h-4 w-4" />
                {urgentFollowUps.length > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive animate-pulse" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-xl border-border">
              <div className="p-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-xs text-foreground">Sales Alerts</span>
                  <Badge variant="warning" className="text-[10px] px-1.5 py-0">
                    {urgentFollowUps.length} Urgent
                  </Badge>
                </div>
                <span className="text-[11px] text-muted-foreground">Real-time</span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {urgentFollowUps.map((item) => (
                  <div key={item.id} className="p-3 hover:bg-muted/40 transition-colors text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-foreground line-clamp-1">{item.title}</span>
                      <span className="text-[10px] text-destructive font-semibold">Today</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{item.relatedTo} • {item.contact}</p>
                  </div>
                ))}
                <div className="p-3 hover:bg-muted/40 transition-colors text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">Deal Won: NeuralPulse</span>
                    <Badge variant="success" className="text-[9px] px-1">+$180k</Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground">Alex Mercer closed Enterprise Tier</p>
                </div>
              </div>
              <div className="p-2 border-t border-border bg-muted/20 text-center">
                <a href="/follow-ups" className="text-xs font-medium text-primary hover:underline">
                  View all follow-up tasks →
                </a>
              </div>
            </PopoverContent>
          </Popover>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Profile Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-2.5 pl-1 pr-2 py-1 rounded-full hover:bg-accent transition-colors select-none cursor-pointer border border-border/50"
              >
                <Avatar className="h-7 w-7 ring-1 ring-border">
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-foreground leading-none">
                    Alex Mercer
                  </span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">
                    Sr. Account Exec
                  </span>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Alex Mercer</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    alex.mercer@salesforge.internal
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => (window.location.href = "/team")}>
                <User className="mr-2 h-4 w-4" />
                <span>My Quota & Stats</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
                <Sliders className="mr-2 h-4 w-4" />
                <span>Sales Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => (window.location.href = "/settings")}>
                <Shield className="mr-2 h-4 w-4" />
                <span>Security & API</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Quick Add Modal */}
      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        defaultTab={quickAddTab}
      />
    </>
  );
}
