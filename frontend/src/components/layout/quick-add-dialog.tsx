"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSalesStore } from "@/context/sales-store";
import { toast } from "sonner";
import { UserPlus, Briefcase, Plus } from "lucide-react";

export function QuickAddDialog({
  isOpen,
  onClose,
  defaultTab = "lead",
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "lead" | "deal";
}) {
  const [activeTab, setActiveTab] = useState<"lead" | "deal">(defaultTab);
  const { addLead, addDeal } = useSalesStore();

  // Lead fields
  const [leadName, setLeadName] = useState("");
  const [leadCompany, setLeadCompany] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEstimate, setLeadEstimate] = useState("50000");
  const [leadSource, setLeadSource] = useState<"Inbound" | "LinkedIn" | "Referral" | "Cold Outreach" | "Event">("Inbound");
  const [leadPriority, setLeadPriority] = useState<"High" | "Medium" | "Low">("High");

  // Deal fields
  const [dealTitle, setDealTitle] = useState("");
  const [dealCompany, setDealCompany] = useState("");
  const [dealValue, setDealValue] = useState("75000");
  const [dealOwner, setDealOwner] = useState("Alex Mercer");

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadCompany || !leadEmail) {
      toast.error("Please fill in required fields: Name, Company, and Email");
      return;
    }

    await addLead({
      name: leadName,
      company: leadCompany,
      email: leadEmail,
      phone: leadPhone || "+1 (555) 000-0000",
      title: "Lead Contact",
      status: "New",
      source: leadSource,
      dealEstimate: Number(leadEstimate) || 50000,
      priority: leadPriority,
      assignedTo: "Alex Mercer",
      notes: "Created via quick action in top navbar.",
    });

    toast.success(`Lead created for ${leadCompany}!`, {
      description: `${leadName} has been added to the Leads pipeline.`,
    });

    setLeadName("");
    setLeadCompany("");
    setLeadEmail("");
    setLeadPhone("");
    onClose();
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dealTitle || !dealCompany) {
      toast.error("Please provide both deal title and company");
      return;
    }

    await addDeal({
      title: dealTitle,
      company: dealCompany,
      value: Number(dealValue) || 50000,
      stage: "discovery",
      probability: 25,
      expectedCloseDate: new Date(Date.now() + 45 * 86400000).toISOString().split("T")[0],
      owner: dealOwner,
      priority: "High",
      tags: ["Direct Inbound", "Q2 Target"],
    });

    toast.success(`Deal added to Discovery pipeline!`, {
      description: `${dealTitle} ($${Number(dealValue).toLocaleString()})`,
    });

    setDealTitle("");
    setDealCompany("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex rounded-lg bg-muted p-1 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("lead")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "lead"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <UserPlus className="h-3.5 w-3.5" />
                New Lead
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("deal")}
                className={`px-3 py-1 rounded-md transition-all flex items-center gap-1.5 ${
                  activeTab === "deal"
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="h-3.5 w-3.5" />
                New Deal
              </button>
            </div>
          </div>
          <DialogTitle>
            {activeTab === "lead" ? "Add Prospective Lead" : "Create New Sales Opportunity"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "lead"
              ? "Capture key contact info and estimated potential to track outreach."
              : "Register an active opportunity directly into the Kanban pipeline."}
          </DialogDescription>
        </DialogHeader>

        {activeTab === "lead" ? (
          <form onSubmit={handleCreateLead} className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Contact Full Name *</label>
                <Input
                  placeholder="e.g. Jordan Miller"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company Name *</label>
                <Input
                  placeholder="e.g. Acme Tech"
                  value={leadCompany}
                  onChange={(e) => setLeadCompany(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Work Email *</label>
                <Input
                  type="email"
                  placeholder="jordan@acme.com"
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Direct Phone</label>
                <Input
                  placeholder="+1 (555) 123-4567"
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Estimated ($)</label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={leadEstimate}
                  onChange={(e) => setLeadEstimate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Source</label>
                <select
                  value={leadSource}
                  onChange={(e) => setLeadSource(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:ring-2 focus:ring-ring outline-none"
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
                  value={leadPriority}
                  onChange={(e) => setLeadPriority(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:ring-2 focus:ring-ring outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-1" />
                Add Lead
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleCreateDeal} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Opportunity Title *</label>
              <Input
                placeholder="e.g. Enterprise Cloud Fleet Migration"
                value={dealTitle}
                onChange={(e) => setDealTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Company Name *</label>
                <Input
                  placeholder="e.g. Globex Corp"
                  value={dealCompany}
                  onChange={(e) => setDealCompany(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Deal Value ($ USD) *</label>
                <Input
                  type="number"
                  placeholder="75000"
                  value={dealValue}
                  onChange={(e) => setDealValue(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Opportunity Owner</label>
              <select
                value={dealOwner}
                onChange={(e) => setDealOwner(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs focus:ring-2 focus:ring-ring outline-none"
              >
                <option value="Alex Mercer">Alex Mercer (Senior AE)</option>
                <option value="Elena Rostova">Elena Rostova (Strategic Lead)</option>
                <option value="David Kim">David Kim (Mid-Market AE)</option>
              </select>
            </div>

            <DialogFooter className="pt-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                <Plus className="h-4 w-4 mr-1" />
                Create Deal
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
