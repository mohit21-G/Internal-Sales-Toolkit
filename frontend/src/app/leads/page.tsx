"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  Mail,
  Phone,
  Building,
  ArrowUpDown,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
  DollarSign,
  Briefcase,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Lead } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LeadsPage() {
  const { leads, addLead, updateLeadStatus, convertLeadToDeal } = useSalesStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  // Modals
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [convertingLead, setConvertingLead] = useState<Lead | null>(null);

  // New Lead Form
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Lead["status"]>("New");
  const [source, setSource] = useState<Lead["source"]>("Inbound");
  const [dealEstimate, setDealEstimate] = useState("65000");
  const [priority, setPriority] = useState<Lead["priority"]>("High");
  const [assignedTo, setAssignedTo] = useState("Alex Mercer");
  const [notes, setNotes] = useState("");

  // Convert Deal Form
  const [convertDealValue, setConvertDealValue] = useState("65000");
  const [convertCloseDate, setConvertCloseDate] = useState("2026-05-15");

  // Filtering Logic
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesSource = sourceFilter === "all" || lead.source === sourceFilter;
      const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesSource && matchesPriority;
    });
  }, [leads, searchQuery, statusFilter, sourceFilter, priorityFilter]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !company || !email) {
      toast.error("Please fill in all required fields (Name, Company, Email)");
      return;
    }

    await addLead({
      name,
      company,
      email,
      phone: phone || "+1 (555) 000-0000",
      title: title || "Prospect Lead",
      status,
      source,
      dealEstimate: Number(dealEstimate) || 50000,
      priority,
      assignedTo,
      notes: notes || "Sourced through internal sales outreach.",
    });

    toast.success(`New lead added!`, {
      description: `${name} from ${company} has been added to the CRM.`,
    });

    // Reset Form
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setTitle("");
    setNotes("");
    setIsAddLeadOpen(false);
  };

  const handleConvertDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!convertingLead) return;

    await convertLeadToDeal(
      convertingLead.id,
      Number(convertDealValue),
      convertCloseDate
    );

    toast.success("Lead converted to Deal Opportunity!", {
      description: `${convertingLead.company} has been moved to Discovery stage in the Kanban board.`,
    });

    setConvertingLead(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Leads Pipeline
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track and nurture inbound inquiries, outbound targets, and qualified opportunities.
          </p>
        </div>
        <Button onClick={() => setIsAddLeadOpen(true)} className="text-xs shadow-md">
          <UserPlus className="h-4 w-4 mr-1.5" />
          Add Lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, company, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:ring-2 focus:ring-ring outline-none text-foreground"
              >
                <option value="all">All Statuses</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Unqualified">Unqualified</option>
              </select>
            </div>

            {/* Source Filter */}
            <div>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:ring-2 focus:ring-ring outline-none text-foreground"
              >
                <option value="all">All Sources</option>
                <option value="Inbound">Inbound</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Cold Outreach">Cold Outreach</option>
                <option value="Event">Event</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs focus:ring-2 focus:ring-ring outline-none text-foreground"
              >
                <option value="all">All Priorities</option>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>
            </div>
          </div>

          {/* Active Filter Indicators */}
          {(searchQuery || statusFilter !== "all" || sourceFilter !== "all" || priorityFilter !== "all") && (
            <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-xs">
              <span className="text-muted-foreground font-medium">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  &ldquo;{searchQuery}&rdquo;
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                </Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  Status: {statusFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setStatusFilter("all")} />
                </Badge>
              )}
              {sourceFilter !== "all" && (
                <Badge variant="secondary" className="gap-1 text-[11px]">
                  Source: {sourceFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSourceFilter("all")} />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setSourceFilter("all");
                  setPriorityFilter("all");
                }}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Reset All
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Lead Contact</TableHead>
                <TableHead>Company & Role</TableHead>
                <TableHead>Est. Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Assigned Rep</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No leads found matching your criteria. Try adjusting the search filters.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-accent/40 transition-colors">
                    {/* Lead Contact */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {lead.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-medium text-xs text-foreground hover:text-primary cursor-pointer"
                            onClick={() => setSelectedLead(lead)}
                          >
                            {lead.name}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{lead.email}</p>
                        </div>
                      </div>
                    </TableCell>

                    {/* Company & Role */}
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium text-foreground">{lead.company}</p>
                        <p className="text-[11px] text-muted-foreground">{lead.title}</p>
                      </div>
                    </TableCell>

                    {/* Value */}
                    <TableCell className="text-xs font-semibold text-foreground">
                      {formatCurrency(lead.dealEstimate)}
                    </TableCell>

                    {/* Status Dropdown */}
                    <TableCell>
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border outline-none cursor-pointer ${
                          lead.status === "Qualified"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : lead.status === "Contacted"
                            ? "bg-sky-500/10 text-sky-600 border-sky-500/20"
                            : lead.status === "Unqualified"
                            ? "bg-muted text-muted-foreground border-border"
                            : "bg-primary/10 text-primary border-primary/20"
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Unqualified">Unqualified</option>
                      </select>
                    </TableCell>

                    {/* Source */}
                    <TableCell>
                      <Badge variant="outline" className="text-[11px] font-normal">
                        {lead.source}
                      </Badge>
                    </TableCell>

                    {/* Priority */}
                    <TableCell>
                      <Badge
                        variant={
                          lead.priority === "High"
                            ? "destructive"
                            : lead.priority === "Medium"
                            ? "warning"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {lead.priority}
                      </Badge>
                    </TableCell>

                    {/* Assigned Rep */}
                    <TableCell className="text-xs text-muted-foreground">
                      {lead.assignedTo}
                    </TableCell>

                    {/* Actions Menu */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Lead Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => setSelectedLead(lead)}>
                            <ExternalLink className="h-4 w-4 mr-2 text-muted-foreground" />
                            View Full Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setConvertingLead(lead);
                              setConvertDealValue(String(lead.dealEstimate));
                            }}
                          >
                            <Briefcase className="h-4 w-4 mr-2 text-primary" />
                            Convert to Deal
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              navigator.clipboard.writeText(lead.email);
                              toast.success("Email copied to clipboard!");
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            Copy Email
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Lead Dialog */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <DialogTitle>Add New Prospect Lead</DialogTitle>
            <DialogDescription>
              Record essential lead details to begin the qualification and outreach cadence.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateLead} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contact Full Name *</label>
                <Input
                  placeholder="e.g. Jordan Miller"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company Name *</label>
                <Input
                  placeholder="e.g. Acme Tech Solutions"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Corporate Email *</label>
                <Input
                  type="email"
                  placeholder="jordan@acmetech.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Direct Phone</label>
                <Input
                  placeholder="+1 (555) 345-9801"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Job Title</label>
                <Input
                  placeholder="e.g. VP of Product Ops"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Est. Deal Value ($)</label>
                <Input
                  type="number"
                  placeholder="65000"
                  value={dealEstimate}
                  onChange={(e) => setDealEstimate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Lead Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="Inbound">Inbound</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Referral">Referral</option>
                  <option value="Cold Outreach">Cold Outreach</option>
                  <option value="Event">Event</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discovery & Qualification Notes</label>
              <textarea
                placeholder="Mention pain points, tech stack requirements, or key timeline goals..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-20 rounded-lg border border-border bg-background p-2.5 text-xs outline-none placeholder:text-muted-foreground"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddLeadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Lead</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Convert Lead to Deal Modal */}
      {convertingLead && (
        <Dialog open={!!convertingLead} onOpenChange={() => setConvertingLead(null)}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" />
                Convert Lead to Pipeline Deal
              </DialogTitle>
              <DialogDescription>
                Convert <strong>{convertingLead.name}</strong> ({convertingLead.company}) into an active opportunity in the Deals Kanban.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleConvertDeal} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deal Value ($ USD)</label>
                <Input
                  type="number"
                  value={convertDealValue}
                  onChange={(e) => setConvertDealValue(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Target Close Date</label>
                <Input
                  type="date"
                  value={convertCloseDate}
                  onChange={(e) => setConvertCloseDate(e.target.value)}
                  required
                />
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">What happens next?</p>
                <p>• Lead status will update to &quot;Qualified&quot;.</p>
                <p>• A new card will appear in the Discovery column on the Deals Kanban board.</p>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setConvertingLead(null)}>
                  Cancel
                </Button>
                <Button type="submit">Confirm & Convert</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Lead Details Modal */}
      {selectedLead && (
        <Dialog open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {selectedLead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <DialogTitle>{selectedLead.name}</DialogTitle>
                    <DialogDescription>{selectedLead.title} at {selectedLead.company}</DialogDescription>
                  </div>
                </div>
                <Badge variant="outline">{selectedLead.status}</Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-muted-foreground block">Email</span>
                  <span className="font-semibold text-foreground">{selectedLead.email}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Direct Phone</span>
                  <span className="font-semibold text-foreground">{selectedLead.phone}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Estimated Deal Potential</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedLead.dealEstimate)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Source Channel</span>
                  <span className="font-semibold text-foreground">{selectedLead.source}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Assigned AE</span>
                  <span className="font-semibold text-foreground">{selectedLead.assignedTo}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Created Date</span>
                  <span className="font-semibold text-foreground">{formatDate(selectedLead.createdAt)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-1.5">Discovery & Qualification Notes</h4>
                <div className="p-3 rounded-lg border border-border bg-card text-muted-foreground leading-relaxed">
                  {selectedLead.notes}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setConvertingLead(selectedLead);
                  setSelectedLead(null);
                }}
              >
                <Briefcase className="h-4 w-4 mr-1.5" />
                Convert to Deal
              </Button>
              <Button onClick={() => setSelectedLead(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
