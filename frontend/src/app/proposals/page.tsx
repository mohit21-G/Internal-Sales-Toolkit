"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Plus,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  DollarSign,
  Percent,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSalesStore } from "@/context/sales-store";
import { Proposal } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ProposalsPage() {
  const { proposals, addProposal } = useSalesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // New Proposal Form
  const [title, setTitle] = useState("");
  const [clientCompany, setClientCompany] = useState("");
  const [clientContact, setClientContact] = useState("");
  const [amount, setAmount] = useState("95000");
  const [status, setStatus] = useState<Proposal["status"]>("Sent");
  const [validUntil, setValidUntil] = useState("2026-05-15");
  const [discountPercentage, setDiscountPercentage] = useState("5");

  const filteredProposals = useMemo(() => {
    return proposals.filter((prop) => {
      const matchesSearch =
        prop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.clientCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prop.proposalNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || prop.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [proposals, searchQuery, statusFilter]);

  const handleCreateProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientCompany) {
      toast.error("Please fill in Proposal Title and Client Company");
      return;
    }

    const created = await addProposal({
      title,
      clientCompany,
      clientContact: clientContact || "Procurement Officer",
      amount: Number(amount) || 50000,
      status,
      validUntil,
      discountPercentage: Number(discountPercentage) || 0,
    });

    toast.success(`Proposal created!`, {
      description: `${created.proposalNumber} for ${clientCompany} (${formatCurrency(Number(amount))})`,
    });

    setTitle("");
    setClientCompany("");
    setClientContact("");
    setIsAddOpen(false);
  };

  const totalValue = proposals
    .filter((p) => p.status !== "Declined")
    .reduce((sum, p) => sum + p.amount, 0);

  const getStatusBadge = (stat: Proposal["status"]) => {
    switch (stat) {
      case "Approved":
        return <Badge variant="success" className="text-[10px]">Approved</Badge>;
      case "Under Review":
        return <Badge variant="warning" className="text-[10px]">Under Review</Badge>;
      case "Sent":
        return <Badge variant="info" className="text-[10px]">Sent</Badge>;
      case "Draft":
        return <Badge variant="secondary" className="text-[10px]">Draft</Badge>;
      case "Declined":
        return <Badge variant="destructive" className="text-[10px]">Declined</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sales Proposals & Quotes
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deliver standardized enterprise agreements, pricing quotes, and SOW documents.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="text-xs shadow-md">
          <Plus className="h-4 w-4 mr-1.5" />
          Create Proposal
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Quote Value
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Decisions
              </p>
              <p className="text-2xl font-bold text-amber-500 mt-1">
                {proposals.filter((p) => p.status === "Under Review" || p.status === "Sent").length} Quotes
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Approved Rate
              </p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">
                {Math.round(
                  (proposals.filter((p) => p.status === "Approved").length / proposals.length) * 100
                )}%
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by proposal #, client, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground"
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Under Review">Under Review</option>
            <option value="Approved">Approved</option>
            <option value="Declined">Declined</option>
          </select>
        </CardContent>
      </Card>

      {/* Proposals Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Proposal ID & Title</TableHead>
                <TableHead>Client Account</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Discount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Valid Until</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="h-32 text-center text-muted-foreground">
                    No proposals found matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProposals.map((prop) => (
                  <TableRow key={prop.id} className="hover:bg-accent/40 transition-colors">
                    <TableCell>
                      <div>
                        <span className="font-mono text-[10px] text-muted-foreground block">
                          {prop.proposalNumber}
                        </span>
                        <span
                          className="font-semibold text-xs text-foreground hover:text-primary cursor-pointer"
                          onClick={() => setSelectedProposal(prop)}
                        >
                          {prop.title}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <p className="font-medium text-foreground">{prop.clientCompany}</p>
                      <p className="text-[11px] text-muted-foreground">{prop.clientContact}</p>
                    </TableCell>

                    <TableCell className="text-xs font-bold text-foreground">
                      {formatCurrency(prop.amount)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {prop.discountPercentage > 0 ? (
                        <Badge variant="purple" className="text-[10px]">
                          {prop.discountPercentage}% Off
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    <TableCell>{getStatusBadge(prop.status)}</TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(prop.validUntil)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(prop.createdDate)}
                    </TableCell>

                    <TableCell className="text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedProposal(prop)}
                        className="h-8 w-8 text-muted-foreground hover:text-primary"
                        title="Preview Proposal Document"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          toast.success(`PDF generated for ${prop.proposalNumber}!`);
                        }}
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        title="Download PDF"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Proposal Modal Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Generate New Sales Proposal</DialogTitle>
            <DialogDescription>
              Issue an official pricing quote and agreement terms for client sign-off.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateProposal} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Proposal Title *</label>
              <Input
                placeholder="e.g. Enterprise Cloud Fleet License Agreement"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Client Company *</label>
                <Input
                  placeholder="e.g. Apex Global Logistics"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Stakeholder Contact</label>
                <Input
                  placeholder="e.g. Sarah Jenkins (VP)"
                  value={clientContact}
                  onChange={(e) => setClientContact(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contract Amount ($ USD) *</label>
                <Input
                  type="number"
                  placeholder="95000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Approved Discount (%)</label>
                <Input
                  type="number"
                  placeholder="5"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Proposal Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Proposal["status"])}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Sent">Sent</option>
                  <option value="Under Review">Under Review</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Valid Until</label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create & Issue Quote</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Proposal Document Preview Modal */}
      {selectedProposal && (
        <Dialog open={!!selectedProposal} onOpenChange={() => setSelectedProposal(null)}>
          <DialogContent className="sm:max-w-[560px]">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div>
                  <span className="font-mono text-xs text-primary font-bold block">
                    {selectedProposal.proposalNumber}
                  </span>
                  <DialogTitle className="text-base">{selectedProposal.title}</DialogTitle>
                </div>
                {getStatusBadge(selectedProposal.status)}
              </div>
            </DialogHeader>

            <div className="space-y-4 py-3 text-xs">
              <div className="p-4 rounded-xl border border-border bg-muted/40 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Client Entity:</span>
                  <span className="font-semibold text-foreground">
                    {selectedProposal.clientCompany} ({selectedProposal.clientContact})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Effective Date:</span>
                  <span className="font-semibold text-foreground">{formatDate(selectedProposal.createdDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offer Expiration:</span>
                  <span className="font-semibold text-destructive">{formatDate(selectedProposal.validUntil)}</span>
                </div>
              </div>

              {/* Commercial Summary Table */}
              <div className="border border-border rounded-xl p-4 bg-card space-y-2">
                <div className="flex justify-between text-muted-foreground pb-2 border-b border-border/50">
                  <span>Item Description</span>
                  <span>Price</span>
                </div>
                <div className="flex justify-between">
                  <span>SalesToolkit Enterprise Platform License (Annual)</span>
                  <span className="font-medium text-foreground">
                    {formatCurrency(selectedProposal.amount / (1 - selectedProposal.discountPercentage / 100))}
                  </span>
                </div>
                {selectedProposal.discountPercentage > 0 && (
                  <div className="flex justify-between text-emerald-500">
                    <span>Approved Commercial Discount ({selectedProposal.discountPercentage}%)</span>
                    <span>
                      -{formatCurrency(
                        (selectedProposal.amount / (1 - selectedProposal.discountPercentage / 100)) *
                          (selectedProposal.discountPercentage / 100)
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-foreground pt-2 border-t border-border">
                  <span>Total Net Contract Value:</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(selectedProposal.amount)}
                  </span>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Proposal ${selectedProposal.proposalNumber} - ${selectedProposal.title} (${formatCurrency(
                      selectedProposal.amount
                    )})`
                  );
                  toast.success("Quote details copied!");
                }}
              >
                <Copy className="h-4 w-4 mr-1.5" />
                Copy Summary
              </Button>
              <Button
                onClick={() => {
                  toast.success("Downloading formal proposal PDF...");
                  setSelectedProposal(null);
                }}
              >
                <Download className="h-4 w-4 mr-1.5" />
                Download PDF
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
