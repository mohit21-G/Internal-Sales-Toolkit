import {
  Lead,
  Deal,
  DealStage,
  Customer,
  FollowUp,
  Proposal,
  TeamMember,
  INITIAL_LEADS,
  INITIAL_DEALS,
  INITIAL_CUSTOMERS,
  INITIAL_FOLLOWUPS,
  INITIAL_PROPOSALS,
  TEAM_MEMBERS,
  REVENUE_TREND_DATA,
  PIPELINE_STAGE_DATA,
  WIN_LOSS_DATA,
} from "@/lib/mock-data";

export interface HealthResponse {
  status: string;
}

export interface EmailGenerateRequest {
  topic: string;
  sender: string;
  recipient: string;
  style: "Formal" | "Appreciating" | "Not Satisfied" | "Neutral" | string;
}

export interface EmailData {
  email_text: string;
  topic: string;
  sender: string;
  recipient: string;
  style: string;
  generated_at: string;
}

export interface EmailGenerateResponse {
  success: boolean;
  message: string;
  data?: EmailData | null;
  error?: any;
}

const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const API_KEY =
  process.env.NEXT_PUBLIC_API_KEY || "9fK-7xP2mQ8vL4nR6sT1yZ5cW0aB3dE7h";

async function fetchWithAuth<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (API_KEY) {
    headers.set("X-API-Key", API_KEY);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMsg = `API request failed with status ${response.status}`;
    try {
      const errData = await response.json();
      if (errData?.message) errorMsg = errData.message;
      else if (errData?.error?.detail) errorMsg = JSON.stringify(errData.error.detail);
    } catch {
      // Use fallback error message
    }
    throw new Error(errorMsg);
  }

  return response.json() as Promise<T>;
}

export const apiService = {
  // Backend Health Check
  health: {
    async check(): Promise<HealthResponse> {
      try {
        return await fetchWithAuth<HealthResponse>("/api/v1/health");
      } catch (err) {
        // Fallback check
        const res = await fetch(`${API_BASE_URL}/health`).catch(() => null);
        if (res && res.ok) {
          return await res.json();
        }
        throw err;
      }
    },
  },

  // Real Existing AI Email Generation API (/api/v1/email/generate)
  email: {
    async generate(payload: EmailGenerateRequest): Promise<EmailGenerateResponse> {
      return await fetchWithAuth<EmailGenerateResponse>("/api/v1/email/generate", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    },
  },

  // Leads API (with graceful fallback to persistent store where no endpoint exists)
  leads: {
    async getAll(): Promise<Lead[]> {
      try {
        return await fetchWithAuth<Lead[]>("/api/v1/leads");
      } catch {
        // Fallback to mock data where backend endpoint does not exist
        return INITIAL_LEADS;
      }
    },
    async create(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead> {
      try {
        return await fetchWithAuth<Lead>("/api/v1/leads", {
          method: "POST",
          body: JSON.stringify(lead),
        });
      } catch {
        // Fallback local creation
        return {
          ...lead,
          id: `lead-${Date.now()}`,
          createdAt: new Date().toISOString().split("T")[0],
        };
      }
    },
    async updateStatus(id: string, status: Lead["status"]): Promise<void> {
      try {
        await fetchWithAuth(`/api/v1/leads/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      } catch {
        // Local fallback
      }
    },
  },

  // Deals API
  deals: {
    async getAll(): Promise<Deal[]> {
      try {
        return await fetchWithAuth<Deal[]>("/api/v1/deals");
      } catch {
        return INITIAL_DEALS;
      }
    },
    async create(deal: Omit<Deal, "id">): Promise<Deal> {
      try {
        return await fetchWithAuth<Deal>("/api/v1/deals", {
          method: "POST",
          body: JSON.stringify(deal),
        });
      } catch {
        return {
          ...deal,
          id: `deal-${Date.now()}`,
        };
      }
    },
    async updateStage(dealId: string, stage: DealStage): Promise<void> {
      try {
        await fetchWithAuth(`/api/v1/deals/${dealId}`, {
          method: "PATCH",
          body: JSON.stringify({ stage }),
        });
      } catch {
        // Local fallback
      }
    },
    async delete(dealId: string): Promise<void> {
      try {
        await fetchWithAuth(`/api/v1/deals/${dealId}`, {
          method: "DELETE",
        });
      } catch {
        // Local fallback
      }
    },
  },

  // Customers API
  customers: {
    async getAll(): Promise<Customer[]> {
      try {
        return await fetchWithAuth<Customer[]>("/api/v1/customers");
      } catch {
        return INITIAL_CUSTOMERS;
      }
    },
  },

  // Follow-ups API
  followUps: {
    async getAll(): Promise<FollowUp[]> {
      try {
        return await fetchWithAuth<FollowUp[]>("/api/v1/follow-ups");
      } catch {
        return INITIAL_FOLLOWUPS;
      }
    },
    async create(followUp: Omit<FollowUp, "id" | "completed">): Promise<FollowUp> {
      try {
        return await fetchWithAuth<FollowUp>("/api/v1/follow-ups", {
          method: "POST",
          body: JSON.stringify(followUp),
        });
      } catch {
        return {
          ...followUp,
          id: `task-${Date.now()}`,
          completed: false,
        };
      }
    },
    async toggle(id: string): Promise<void> {
      try {
        await fetchWithAuth(`/api/v1/follow-ups/${id}/toggle`, {
          method: "POST",
        });
      } catch {
        // Local fallback
      }
    },
  },

  // Proposals API
  proposals: {
    async getAll(): Promise<Proposal[]> {
      try {
        return await fetchWithAuth<Proposal[]>("/api/v1/proposals");
      } catch {
        return INITIAL_PROPOSALS;
      }
    },
    async create(
      proposal: Omit<Proposal, "id" | "createdDate" | "proposalNumber">
    ): Promise<Proposal> {
      try {
        return await fetchWithAuth<Proposal>("/api/v1/proposals", {
          method: "POST",
          body: JSON.stringify(proposal),
        });
      } catch {
        const randomNum = Math.floor(100 + Math.random() * 900);
        return {
          ...proposal,
          id: `prop-${Date.now()}`,
          proposalNumber: `PROP-2026-${randomNum}`,
          createdDate: new Date().toISOString().split("T")[0],
        };
      }
    },
  },

  // Team API
  team: {
    async getAll(): Promise<TeamMember[]> {
      try {
        return await fetchWithAuth<TeamMember[]>("/api/v1/team");
      } catch {
        return TEAM_MEMBERS;
      }
    },
  },

  // Analytics API
  analytics: {
    async getRevenueTrends() {
      try {
        return await fetchWithAuth<typeof REVENUE_TREND_DATA>("/api/v1/analytics/revenue");
      } catch {
        return REVENUE_TREND_DATA;
      }
    },
    async getPipelineStages() {
      try {
        return await fetchWithAuth<typeof PIPELINE_STAGE_DATA>("/api/v1/analytics/stages");
      } catch {
        return PIPELINE_STAGE_DATA;
      }
    },
    async getWinLoss() {
      try {
        return await fetchWithAuth<typeof WIN_LOSS_DATA>("/api/v1/analytics/win-loss");
      } catch {
        return WIN_LOSS_DATA;
      }
    },
  },
};
