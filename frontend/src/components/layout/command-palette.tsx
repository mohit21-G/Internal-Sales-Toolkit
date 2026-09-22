"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Search,
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
  ArrowRight,
} from "lucide-react";
import { useSalesStore } from "@/context/sales-store";

export function CommandPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const { leads, deals } = useSalesStore();

  const pages = [
    { title: "Dashboard", href: "/", icon: LayoutDashboard, category: "Navigation" },
    { title: "Leads Directory", href: "/leads", icon: Users, category: "Navigation" },
    { title: "Deals Kanban", href: "/deals", icon: Briefcase, category: "Navigation" },
    { title: "Customers Roster", href: "/customers", icon: Building2, category: "Navigation" },
    { title: "Follow-ups & Tasks", href: "/follow-ups", icon: CalendarCheck, category: "Navigation" },
    { title: "Proposals Pipeline", href: "/proposals", icon: FileText, category: "Navigation" },
    { title: "Sales Collateral & Resources", href: "/resources", icon: FolderArchive, category: "Navigation" },
    { title: "Sales Analytics & Funnel", href: "/analytics", icon: BarChart3, category: "Navigation" },
    { title: "Sales Team & Quota", href: "/team", icon: UserCheck, category: "Navigation" },
    { title: "Toolkit Settings", href: "/settings", icon: Settings, category: "Navigation" },
  ];

  const filteredPages = pages.filter((p) =>
    p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads
    .filter(
      (l) =>
        l.name.toLowerCase().includes(query.toLowerCase()) ||
        l.company.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 4);

  const filteredDeals = deals
    .filter(
      (d) =>
        d.title.toLowerCase().includes(query.toLowerCase()) ||
        d.company.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 3);

  const handleSelect = (url: string) => {
    onClose();
    router.push(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="p-0 gap-0 overflow-hidden sm:max-w-[550px] border-border shadow-2xl">
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            autoFocus
            type="text"
            placeholder="Search leads, deals, resources, or jump to page... (Esc to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm placeholder:text-muted-foreground outline-none text-foreground"
          />
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-3">
          {/* Navigation Section */}
          {filteredPages.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1 tracking-wider">
                Pages
              </p>
              <div className="space-y-0.5">
                {filteredPages.slice(0, 5).map((page) => {
                  const Icon = page.icon;
                  return (
                    <button
                      key={page.href}
                      onClick={() => handleSelect(page.href)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-accent text-foreground transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                        <span>{page.title}</span>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Leads Matches */}
          {filteredLeads.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1 tracking-wider">
                Leads
              </p>
              <div className="space-y-0.5">
                {filteredLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => handleSelect("/leads")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-accent text-foreground transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">
                        {lead.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-xs leading-tight">{lead.name}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.company}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                      ${lead.dealEstimate.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Deals Matches */}
          {filteredDeals.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-muted-foreground uppercase px-2 py-1 tracking-wider">
                Deals Pipeline
              </p>
              <div className="space-y-0.5">
                {filteredDeals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => handleSelect("/deals")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm hover:bg-accent text-foreground transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Briefcase className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                      <div className="text-left">
                        <p className="font-medium text-xs leading-tight">{deal.title}</p>
                        <p className="text-[11px] text-muted-foreground">{deal.company}</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      ${deal.value.toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredPages.length === 0 && filteredLeads.length === 0 && filteredDeals.length === 0 && (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No matching results found for &ldquo;{query}&rdquo;
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-muted/40 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Press <strong>Esc</strong> to exit</span>
          <span>Click any item to jump directly</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
