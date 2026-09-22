"use client";

import React, { useState, useMemo } from "react";
import {
  Kanban,
  Table as TableIcon,
  Plus,
  DollarSign,
  Calendar,
  User,
  MoreVertical,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSalesStore } from "@/context/sales-store";
import { Deal, DealStage } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

const STAGES: { id: DealStage; label: string; color: string; border: string }[] = [
  { id: "discovery", label: "Discovery", color: "bg-indigo-500", border: "border-indigo-500/20" },
  { id: "qualified", label: "Qualified", color: "bg-blue-500", border: "border-blue-500/20" },
  { id: "proposal", label: "Proposal Sent", color: "bg-purple-500", border: "border-purple-500/20" },
  { id: "negotiation", label: "Negotiation", color: "bg-amber-500", border: "border-amber-500/20" },
  { id: "closed-won", label: "Closed Won", color: "bg-emerald-500", border: "border-emerald-500/20" },
  { id: "closed-lost", label: "Closed Lost", color: "bg-slate-500", border: "border-slate-500/20" },
];

export default function DealsPage() {
  const { deals, updateDealStage, addDeal, deleteDeal } = useSalesStore();
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [searchQuery, setSearchQuery] = useState("");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [isNewDealOpen, setIsNewDealOpen] = useState(false);

  // New Deal Form State
  const [dealTitle, setDealTitle] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealValue, setDealValue] = useState("85000");
  const [dealStage, setDealStage] = useState<DealStage>("discovery");
  const [dealOwner, setDealOwner] = useState("Alex Mercer");
  const [dealCloseDate, setDealCloseDate] = useState("2026-04-30");
  const [dealPriority, setDealPriority] = useState<"High" | "Medium" | "Low">("High");

  // Filtering
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOwner = ownerFilter === "all" || deal.owner === ownerFilter;
      return matchesSearch && matchesOwner;
    });
  }, [deals, searchQuery, ownerFilter]);

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCompany) {
      toast.error("Please provide both Opportunity Title and Company Name.");
      return;
    }

    await addDeal({
      title: dealTitle,
      company: dealCompany,
      value: Number(dealValue) || 50000,
      stage: dealStage,
      probability: dealStage === "closed-won" ? 100 : dealStage === "proposal" ? 65 : 30,
      expectedCloseDate: dealCloseDate,
      owner: dealOwner,
      priority: dealPriority,
      tags: ["Internal Sourced", "High Priority"],
    });

    toast.success("Opportunity added to deals pipeline!", {
      description: `${dealTitle} - ${formatCurrency(Number(dealValue))}`,
    });

    setDealTitle("");
    setDealCompany("");
    setIsNewDealOpen(false);
  };

  const handleStageChange = async (dealId: string, newStage: DealStage, dealName: string) => {
    await updateDealStage(dealId, newStage);
    const stageName = STAGES.find((s) => s.id === newStage)?.label;
    toast.success(`Moved deal to ${stageName}`, {
      description: dealName,
    });
  };

  const handleDeleteDeal = async (dealId: string, dealName: string) => {
    await deleteDeal(dealId);
    toast.info(`Deleted deal: ${dealName}`);
  };

  const totalFilteredValue = filteredDeals
    .filter((d) => d.stage !== "closed-lost")
    .reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Deals & Opportunities
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage stage progression, probabilities, and revenue forecasts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-medium">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "kanban"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Kanban className="h-3.5 w-3.5" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "table"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <TableIcon className="h-3.5 w-3.5" />
              Table
            </button>
          </div>

          <Button onClick={() => setIsNewDealOpen(true)} className="text-xs shadow-md">
            <Plus className="h-4 w-4 mr-1.5" />
            New Deal
          </Button>
        </div>
      </div>

      {/* Filter and Metrics Summary Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-border bg-card">
        <div className="flex flex-wrap items-center gap-2.5">
          <Input
            placeholder="Search deals or accounts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-64 h-8 text-xs"
          />

          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="h-8 rounded-lg border border-border bg-background px-2.5 text-xs outline-none text-foreground"
          >
            <option value="all">All Sales Owners</option>
            <option value="Alex Mercer">Alex Mercer</option>
            <option value="Elena Rostova">Elena Rostova</option>
            <option value="David Kim">David Kim</option>
          </select>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="text-muted-foreground">Showing {filteredDeals.length} deals:</span>
          <span className="font-bold text-foreground bg-primary/10 text-primary px-2.5 py-1 rounded-full border border-primary/20">
            {formatCurrency(totalFilteredValue)} Active Pipeline
          </span>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4">
          {STAGES.map((stage) => {
            const stageDeals = filteredDeals.filter((d) => d.stage === stage.id);
            const stageSum = stageDeals.reduce((sum, d) => sum + d.value, 0);

            return (
              <div
                key={stage.id}
                className="flex flex-col rounded-xl border border-border bg-card/50 min-w-[250px] shadow-xs"
              >
                {/* Column Header */}
                <div className="p-3 border-b border-border/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                    <span className="font-semibold text-xs text-foreground">
                      {stage.label}
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                    {stageDeals.length}
                  </Badge>
                </div>

                {/* Column Sub-stat: Stage Value */}
                <div className="px-3 py-1.5 bg-muted/20 border-b border-border/40 text-[11px] font-semibold text-muted-foreground flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-foreground">{formatCurrency(stageSum)}</span>
                </div>

                {/* Cards Container */}
                <div className="p-2 space-y-2.5 flex-1 min-h-[420px]">
                  {stageDeals.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-border/50 rounded-lg text-[11px] text-muted-foreground/60 text-center p-2">
                      No deals in {stage.label}
                    </div>
                  ) : (
                    stageDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="p-3 rounded-lg border border-border bg-card hover:border-primary/50 transition-all shadow-xs hover:shadow-md space-y-2 group relative"
                      >
                        {/* Company & Priority */}
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-[11px] text-primary truncate max-w-[140px]">
                            {deal.company}
                          </span>
                          <Badge
                            variant={
                              deal.priority === "High"
                                ? "destructive"
                                : deal.priority === "Medium"
                                ? "warning"
                                : "secondary"
                            }
                            className="text-[9px] px-1 py-0"
                          >
                            {deal.priority}
                          </Badge>
                        </div>

                        {/* Title */}
                        <p className="font-semibold text-xs text-foreground line-clamp-2 leading-tight">
                          {deal.title}
                        </p>

                        {/* Value & Probability */}
                        <div className="flex items-center justify-between text-xs pt-1 border-t border-border/40">
                          <span className="font-bold text-foreground">
                            {formatCurrency(deal.value)}
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {deal.probability}% Prob
                          </span>
                        </div>

                        {/* Close Date & Owner */}
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(deal.expectedCloseDate)}
                          </span>
                          <div className="h-5 w-5 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-[9px]">
                            {deal.owner.slice(0, 2).toUpperCase()}
                          </div>
                        </div>

                        {/* Move Stage Selector & Actions */}
                        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-1">
                          <select
                            value={deal.stage}
                            onChange={(e) =>
                              handleStageChange(deal.id, e.target.value as DealStage, deal.title)
                            }
                            className="text-[10px] bg-muted/60 hover:bg-muted text-foreground rounded px-1.5 py-1 border border-border/60 outline-none cursor-pointer flex-1"
                          >
                            {STAGES.map((s) => (
                              <option key={s.id} value={s.id}>
                                Move: {s.label}
                              </option>
                            ))}
                          </select>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground">
                                <MoreVertical className="h-3.5 w-3.5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-36">
                              <DropdownMenuItem
                                onClick={() => handleDeleteDeal(deal.id, deal.title)}
                                className="text-destructive focus:text-destructive text-xs"
                              >
                                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                Remove Deal
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Opportunity / Deal</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Value ($)</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Target Close</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeals.map((deal) => (
                  <TableRow key={deal.id} className="hover:bg-accent/40">
                    <TableCell>
                      <div>
                        <p className="font-semibold text-xs text-foreground">{deal.title}</p>
                        <div className="flex gap-1 mt-0.5">
                          {deal.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] bg-secondary text-secondary-foreground px-1 py-0.2 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {deal.company}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {formatCurrency(deal.value)}
                    </TableCell>
                    <TableCell>
                      <select
                        value={deal.stage}
                        onChange={(e) =>
                          handleStageChange(deal.id, e.target.value as DealStage, deal.title)
                        }
                        className="text-xs font-medium px-2 py-1 rounded-full border border-border bg-background outline-none cursor-pointer"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {deal.probability}%
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(deal.expectedCloseDate)}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {deal.owner}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteDeal(deal.id, deal.title)}
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* New Deal Modal Dialog */}
      <Dialog open={isNewDealOpen} onOpenChange={setIsNewDealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Opportunity to Pipeline</DialogTitle>
            <DialogDescription>
              Create a deal record with deal size, expected close date, and pipeline stage.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateDeal} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Opportunity Title *</label>
              <Input
                placeholder="e.g. Enterprise Global Deployment"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company Name *</label>
                <Input
                  placeholder="e.g. Acme Corp"
                  value={dealCompany}
                  onChange={(e) => setDealCompany(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deal Value ($ USD) *</label>
                <Input
                  type="number"
                  placeholder="85000"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Starting Stage</label>
                <select
                  value={dealStage}
                  onChange={(e) => setDealStage(e.target.value as DealStage)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  value={dealPriority}
                  onChange={(e) => setDealPriority(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Expected Close Date</label>
                <Input
                  type="date"
                  value={dealCloseDate}
                  onChange={(e) => setDealCloseDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deal Owner</label>
                <select
                  value={dealOwner}
                  onChange={(e) => setDealOwner(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="Alex Mercer">Alex Mercer</option>
                  <option value="Elena Rostova">Elena Rostova</option>
                  <option value="David Kim">David Kim</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsNewDealOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Deal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
