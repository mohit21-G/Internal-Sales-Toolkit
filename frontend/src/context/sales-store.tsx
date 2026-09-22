"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Lead,
  Deal,
  DealStage,
  Customer,
  FollowUp,
  Proposal,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_CUSTOMERS,
  INITIAL_FOLLOWUPS,
  INITIAL_PROPOSALS,
} from "@/lib/mock-data";
import { apiService, EmailGenerateRequest } from "@/services/api";
import { toast } from "sonner";

interface SalesContextType {
  leads: Lead[];
  deals: Deal[];
  customers: Customer[];
  followUps: FollowUp[];
  proposals: Proposal[];
  isLoading: boolean;
  isError: boolean;
  backendStatus: "checking" | "connected" | "offline";
  addLead: (lead: Omit<Lead, "id" | "createdAt">) => Promise<Lead>;
  updateLeadStatus: (id: string, status: Lead["status"]) => Promise<void>;
  convertLeadToDeal: (leadId: string, value: number, expectedCloseDate: string) => Promise<Deal>;
  addDeal: (deal: Omit<Deal, "id">) => Promise<Deal>;
  updateDealStage: (dealId: string, stage: DealStage) => Promise<void>;
  deleteDeal: (dealId: string) => Promise<void>;
  addFollowUp: (followUp: Omit<FollowUp, "id" | "completed">) => Promise<FollowUp>;
  toggleFollowUp: (id: string) => Promise<void>;
  addProposal: (proposal: Omit<Proposal, "id" | "createdDate" | "proposalNumber">) => Promise<Proposal>;
  generateAiEmail: (payload: EmailGenerateRequest) => Promise<string>;
  stats: {
    totalPipelineValue: number;
    weightedPipelineValue: number;
    activeLeadsCount: number;
    wonThisMonthValue: number;
    pendingFollowUpsCount: number;
    totalCustomersCount: number;
  };
}

const SalesContext = createContext<SalesContextType | undefined>(undefined);

export function SalesProvider({ children }: { children: React.ReactNode }) {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOWUPS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "offline">("checking");

  // Initial Load from API
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);

        // Check backend health
        try {
          const health = await apiService.health.check();
          if (health && isMounted) {
            setBackendStatus("connected");
          }
        } catch {
          if (isMounted) setBackendStatus("offline");
        }

        // Fetch data via centralized API service
        const [fetchedLeads, fetchedDeals, fetchedCustomers, fetchedFollowUps, fetchedProposals] =
          await Promise.all([
            apiService.leads.getAll(),
            apiService.deals.getAll(),
            apiService.customers.getAll(),
            apiService.followUps.getAll(),
            apiService.proposals.getAll(),
          ]);

        if (isMounted) {
          if (fetchedLeads?.length) setLeads(fetchedLeads);
          if (fetchedDeals?.length) setDeals(fetchedDeals);
          if (fetchedCustomers?.length) setCustomers(fetchedCustomers);
          if (fetchedFollowUps?.length) setFollowUps(fetchedFollowUps);
          if (fetchedProposals?.length) setProposals(fetchedProposals);
        }
      } catch (err) {
        if (isMounted) {
          setIsError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const addLead = async (newLeadData: Omit<Lead, "id" | "createdAt">): Promise<Lead> => {
    try {
      const created = await apiService.leads.create(newLeadData);
      setLeads((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: Lead = {
        ...newLeadData,
        id: `lead-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setLeads((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateLeadStatus = async (id: string, status: Lead["status"]) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
    await apiService.leads.updateStatus(id, status);
  };

  const convertLeadToDeal = async (
    leadId: string,
    value: number,
    expectedCloseDate: string
  ): Promise<Deal> => {
    const lead = leads.find((l) => l.id === leadId);
    const company = lead ? lead.company : "New Client";
    const dealData: Omit<Deal, "id"> = {
      title: `${company} - Core License`,
      company: company,
      value: value || (lead ? lead.dealEstimate : 50000),
      stage: "discovery",
      probability: 25,
      expectedCloseDate: expectedCloseDate || "2026-05-30",
      owner: lead ? lead.assignedTo : "Alex Mercer",
      priority: lead?.priority || "Medium",
      tags: ["Converted Lead", lead?.source || "Inbound"],
    };

    const newDeal = await addDeal(dealData);
    if (lead) {
      await updateLeadStatus(leadId, "Qualified");
    }
    return newDeal;
  };

  const addDeal = async (dealData: Omit<Deal, "id">): Promise<Deal> => {
    try {
      const created = await apiService.deals.create(dealData);
      setDeals((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: Deal = {
        ...dealData,
        id: `deal-${Date.now()}`,
      };
      setDeals((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const updateDealStage = async (dealId: string, stage: DealStage) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id === dealId) {
          let prob = deal.probability;
          if (stage === "discovery") prob = 20;
          if (stage === "qualified") prob = 40;
          if (stage === "proposal") prob = 65;
          if (stage === "negotiation") prob = 85;
          if (stage === "closed-won") prob = 100;
          if (stage === "closed-lost") prob = 0;
          return { ...deal, stage, probability: prob };
        }
        return deal;
      })
    );
    await apiService.deals.updateStage(dealId, stage);
  };

  const deleteDeal = async (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    await apiService.deals.delete(dealId);
  };

  const addFollowUp = async (
    followUpData: Omit<FollowUp, "id" | "completed">
  ): Promise<FollowUp> => {
    try {
      const created = await apiService.followUps.create(followUpData);
      setFollowUps((prev) => [created, ...prev]);
      return created;
    } catch {
      const fallback: FollowUp = {
        ...followUpData,
        id: `task-${Date.now()}`,
        completed: false,
      };
      setFollowUps((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const toggleFollowUp = async (id: string) => {
    setFollowUps((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
    await apiService.followUps.toggle(id);
  };

  const addProposal = async (
    propData: Omit<Proposal, "id" | "createdDate" | "proposalNumber">
  ): Promise<Proposal> => {
    try {
      const created = await apiService.proposals.create(propData);
      setProposals((prev) => [created, ...prev]);
      return created;
    } catch {
      const randomNum = Math.floor(100 + Math.random() * 900);
      const fallback: Proposal = {
        ...propData,
        id: `prop-${Date.now()}`,
        proposalNumber: `PROP-2026-${randomNum}`,
        createdDate: new Date().toISOString().split("T")[0],
      };
      setProposals((prev) => [fallback, ...prev]);
      return fallback;
    }
  };

  const generateAiEmail = async (payload: EmailGenerateRequest): Promise<string> => {
    const res = await apiService.email.generate(payload);
    if (!res.success || !res.data?.email_text) {
      throw new Error(res.message || "Failed to generate AI email");
    }
    return res.data.email_text;
  };

  // Derived stats
  const totalPipelineValue = deals
    .filter((d) => d.stage !== "closed-lost")
    .reduce((sum, d) => sum + d.value, 0);

  const weightedPipelineValue = deals
    .filter((d) => d.stage !== "closed-lost")
    .reduce((sum, d) => sum + (d.value * d.probability) / 100, 0);

  const activeLeadsCount = leads.filter(
    (l) => l.status !== "Unqualified"
  ).length;

  const wonThisMonthValue = deals
    .filter((d) => d.stage === "closed-won")
    .reduce((sum, d) => sum + d.value, 0);

  const pendingFollowUpsCount = followUps.filter((f) => !f.completed).length;

  const totalCustomersCount = customers.length;

  return (
    <SalesContext.Provider
      value={{
        leads,
        deals,
        customers,
        followUps,
        proposals,
        isLoading,
        isError,
        backendStatus,
        addLead,
        updateLeadStatus,
        convertLeadToDeal,
        addDeal,
        updateDealStage,
        deleteDeal,
        addFollowUp,
        toggleFollowUp,
        addProposal,
        generateAiEmail,
        stats: {
          totalPipelineValue,
          weightedPipelineValue,
          activeLeadsCount,
          wonThisMonthValue,
          pendingFollowUpsCount,
          totalCustomersCount,
        },
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSalesStore() {
  const context = useContext(SalesContext);
  if (!context) {
    throw new Error("useSalesStore must be used within a SalesProvider");
  }
  return context;
}
