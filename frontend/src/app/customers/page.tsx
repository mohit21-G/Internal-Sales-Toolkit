"use client";

import React, { useState, useMemo } from "react";
import {
  Building2,
  Search,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Calendar,
  DollarSign,
  HeartPulse,
  TrendingUp,
  ExternalLink,
  Plus,
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
import { Customer } from "@/lib/mock-data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function CustomersPage() {
  const { customers } = useSalesStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = useMemo(() => {
    return customers.filter((cust) => {
      const matchesSearch =
        cust.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cust.industry.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === "all" || cust.tier === tierFilter;
      const matchesStatus = statusFilter === "all" || cust.status === statusFilter;
      return matchesSearch && matchesTier && matchesStatus;
    });
  }, [customers, searchQuery, tierFilter, statusFilter]);

  const totalARR = customers.reduce((sum, c) => sum + c.arr, 0);
  const avgHealth = Math.round(
    customers.reduce((sum, c) => sum + c.healthScore, 0) / customers.length
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Customer Directory & Accounts
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor client health scores, contracted ARR, renewals, and account reps.
          </p>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Contracted ARR
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {formatCurrency(totalARR)}
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
                Average Account Health
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-2xl font-bold text-emerald-500">{avgHealth}%</p>
                <Badge variant="success" className="text-[10px]">Healthy</Badge>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <HeartPulse className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Active Client Accounts
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {customers.length} Companies
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Building2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search company, contact, or industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground"
            >
              <option value="all">All Tiers</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Growth">Growth</option>
              <option value="Starter">Starter</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground"
            >
              <option value="all">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Onboarding">Onboarding</option>
              <option value="At Risk">At Risk</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Customer Company</TableHead>
                <TableHead>Primary Stakeholder</TableHead>
                <TableHead>Contract Tier</TableHead>
                <TableHead>Annual ARR</TableHead>
                <TableHead>Account Health</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Renewal Date</TableHead>
                <TableHead>Account Exec</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                    No customers found matching filter criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((cust) => (
                  <TableRow key={cust.id} className="hover:bg-accent/40 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          {cust.company.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p
                            className="font-semibold text-xs text-foreground hover:text-primary cursor-pointer"
                            onClick={() => setSelectedCustomer(cust)}
                          >
                            {cust.company}
                          </p>
                          <p className="text-[11px] text-muted-foreground">{cust.industry}</p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs">
                      <p className="font-medium text-foreground">{cust.contactName}</p>
                      <p className="text-[11px] text-muted-foreground">{cust.contactEmail}</p>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          cust.tier === "Enterprise"
                            ? "purple"
                            : cust.tier === "Growth"
                            ? "info"
                            : "secondary"
                        }
                        className="text-[10px]"
                      >
                        {cust.tier}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs font-bold text-foreground">
                      {formatCurrency(cust.arr)}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-secondary h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              cust.healthScore >= 80
                                ? "bg-emerald-500"
                                : cust.healthScore >= 65
                                ? "bg-amber-500"
                                : "bg-destructive"
                            }`}
                            style={{ width: `${cust.healthScore}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold">{cust.healthScore}%</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant={
                          cust.status === "Active"
                            ? "success"
                            : cust.status === "Onboarding"
                            ? "info"
                            : "destructive"
                        }
                        className="text-[10px]"
                      >
                        {cust.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(cust.contractRenewal)}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {cust.owner}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedCustomer(cust)}
                        className="h-8 text-xs text-primary"
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
          <DialogContent className="sm:max-w-[520px]">
            <DialogHeader>
              <div className="flex items-center justify-between pr-6">
                <div>
                  <DialogTitle>{selectedCustomer.company}</DialogTitle>
                  <DialogDescription>{selectedCustomer.industry} • {selectedCustomer.tier} Tier</DialogDescription>
                </div>
                <Badge
                  variant={selectedCustomer.status === "Active" ? "success" : "warning"}
                >
                  {selectedCustomer.status}
                </Badge>
              </div>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-muted/40 border border-border">
                <div>
                  <span className="text-muted-foreground block">Key Contact</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.contactName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Contact Email</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.contactEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Annual Recurring Revenue</span>
                  <span className="font-bold text-emerald-500">{formatCurrency(selectedCustomer.arr)} / yr</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Next Renewal</span>
                  <span className="font-semibold text-foreground">{formatDate(selectedCustomer.contractRenewal)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Health Score</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.healthScore} / 100</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Account Manager</span>
                  <span className="font-semibold text-foreground">{selectedCustomer.owner}</span>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                <p className="font-semibold text-foreground">Recent Account Signals</p>
                <p className="text-muted-foreground leading-relaxed">
                  System telemetry indicates strong weekly active user adoption (92% DAU/MAU). Renewal agreement preparation scheduled 60 days before contract expiry.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  navigator.clipboard.writeText(selectedCustomer.contactEmail);
                  toast.success("Contact email copied to clipboard!");
                }}
              >
                <Mail className="h-4 w-4 mr-1.5" />
                Email Stakeholder
              </Button>
              <Button onClick={() => setSelectedCustomer(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
