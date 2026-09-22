export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  title: string;
  status: "New" | "Contacted" | "Qualified" | "Unqualified";
  source: "LinkedIn" | "Inbound" | "Referral" | "Cold Outreach" | "Event";
  dealEstimate: number;
  priority: "High" | "Medium" | "Low";
  assignedTo: string;
  createdAt: string;
  notes: string;
}

export type DealStage =
  | "discovery"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "closed-won"
  | "closed-lost";

export interface Deal {
  id: string;
  title: string;
  company: string;
  value: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  owner: string;
  priority: "High" | "Medium" | "Low";
  tags: string[];
}

export interface Customer {
  id: string;
  company: string;
  contactName: string;
  contactEmail: string;
  tier: "Enterprise" | "Growth" | "Starter";
  arr: number;
  status: "Active" | "Onboarding" | "At Risk";
  healthScore: number; // 0 - 100
  contractRenewal: string;
  owner: string;
  industry: string;
}

export interface FollowUp {
  id: string;
  title: string;
  relatedTo: string;
  contact: string;
  type: "call" | "email" | "meeting" | "demo" | "proposal-review";
  dueDate: string;
  priority: "High" | "Medium" | "Low";
  completed: boolean;
  notes: string;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  title: string;
  clientCompany: string;
  clientContact: string;
  amount: number;
  status: "Draft" | "Sent" | "Under Review" | "Approved" | "Declined";
  validUntil: string;
  createdDate: string;
  discountPercentage: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  avatar: string;
  dealsClosed: number;
  quotaTarget: number;
  quotaAttained: number;
  winRate: number;
  activeDeals: number;
}

export interface EmailTemplate {
  id: string;
  title: string;
  category: "Cold Outreach" | "Follow-up" | "Demo Confirmation" | "Contract Closing";
  subject: string;
  body: string;
}

export interface CaseStudy {
  id: string;
  company: string;
  logoText: string;
  industry: string;
  headline: string;
  highlightMetric: string;
  metricLabel: string;
  summary: string;
  tags: string[];
}

export interface ResourceDocument {
  id: string;
  title: string;
  category: "Pitch Deck" | "Pricing Sheet" | "Security" | "One-Pager" | "Battlecard";
  fileType: "PDF" | "PPTX" | "XLSX";
  fileSize: string;
  lastUpdated: string;
  downloadsCount: number;
}

// Initial Mock Data Sets
export const INITIAL_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Sarah Jenkins",
    company: "Apex Global Logistics",
    email: "sarah.j@apexlogistics.io",
    phone: "+1 (555) 234-8901",
    title: "VP of Supply Chain",
    status: "Qualified",
    source: "Inbound",
    dealEstimate: 78000,
    priority: "High",
    assignedTo: "Alex Mercer",
    createdAt: "2026-03-12",
    notes: "Evaluating multi-region warehouse management automation. Needs pilot in Q2.",
  },
  {
    id: "lead-2",
    name: "Marcus Vance",
    company: "CloudScale Networks",
    email: "mvance@cloudscale.net",
    phone: "+1 (555) 345-6712",
    title: "Chief Information Officer",
    status: "Contacted",
    source: "LinkedIn",
    dealEstimate: 145000,
    priority: "High",
    assignedTo: "Elena Rostova",
    createdAt: "2026-03-14",
    notes: "Connected after our webinar on distributed edge compute orchestration.",
  },
  {
    id: "lead-3",
    name: "Priya Sharma",
    company: "Fintech Horizon",
    email: "priya@finhorizon.com",
    phone: "+1 (555) 456-1188",
    title: "Director of Product Ops",
    status: "New",
    source: "Referral",
    dealEstimate: 62000,
    priority: "Medium",
    assignedTo: "David Kim",
    createdAt: "2026-03-16",
    notes: "Referred by Stripe account lead. Interested in automated revenue reconciliation.",
  },
  {
    id: "lead-4",
    name: "Julian Brooks",
    company: "BioHealth Diagnostics",
    email: "j.brooks@biohealthdx.org",
    phone: "+1 (555) 872-3199",
    title: "Head of Operations",
    status: "Qualified",
    source: "Event",
    dealEstimate: 110000,
    priority: "High",
    assignedTo: "Alex Mercer",
    createdAt: "2026-03-10",
    notes: "Met at BioTech Summit 2026. HIPAA compliance requirements verified.",
  },
  {
    id: "lead-5",
    name: "Chloe Dupont",
    company: "LuxeRetail Group",
    email: "cdupont@luxeretail.fr",
    phone: "+33 1 42 68 55 00",
    title: "Global E-Commerce Lead",
    status: "Contacted",
    source: "Inbound",
    dealEstimate: 95000,
    priority: "Medium",
    assignedTo: "Elena Rostova",
    createdAt: "2026-03-15",
    notes: "Omnichannel inventory sync requirement. Budget approved for H2.",
  },
  {
    id: "lead-6",
    name: "Thomas Sterling",
    company: "Vanguard Mobility",
    email: "t.sterling@vanguardmob.com",
    phone: "+1 (555) 902-1432",
    title: "Fleet Operations Director",
    status: "Unqualified",
    source: "Cold Outreach",
    dealEstimate: 28000,
    priority: "Low",
    assignedTo: "David Kim",
    createdAt: "2026-03-08",
    notes: "Under 50 vehicle fleet. Better fit for self-serve starter tier down the line.",
  },
  {
    id: "lead-7",
    name: "Amara Okonjo",
    company: "Helios Solar Tech",
    email: "amara@heliostech.energy",
    phone: "+1 (555) 762-9018",
    title: "COO",
    status: "New",
    source: "LinkedIn",
    dealEstimate: 88000,
    priority: "High",
    assignedTo: "Alex Mercer",
    createdAt: "2026-03-16",
    notes: "Expanding to 4 new regional solar microgrid projects. Scheduled intro call.",
  },
  {
    id: "lead-8",
    name: "Liam O'Connor",
    company: "DataForge Analytics",
    email: "liam@dataforge.io",
    phone: "+1 (555) 601-8843",
    title: "VP Engineering",
    status: "Contacted",
    source: "Inbound",
    dealEstimate: 54000,
    priority: "Medium",
    assignedTo: "Elena Rostova",
    createdAt: "2026-03-14",
    notes: "Need direct Snowflake & BigQuery connector support.",
  },
];

export const INITIAL_DEALS: Deal[] = [
  {
    id: "deal-1",
    title: "Enterprise Multi-Region Deployment",
    company: "Apex Global Logistics",
    value: 92000,
    stage: "negotiation",
    probability: 85,
    expectedCloseDate: "2026-04-15",
    owner: "Alex Mercer",
    priority: "High",
    tags: ["Enterprise", "Multi-Region", "SLA 99.99%"],
  },
  {
    id: "deal-2",
    title: "Cloud Edge Infrastructure Overhaul",
    company: "CloudScale Networks",
    value: 155000,
    stage: "proposal",
    probability: 60,
    expectedCloseDate: "2026-04-30",
    owner: "Elena Rostova",
    priority: "High",
    tags: ["Security Audit", "Quarterly Billing"],
  },
  {
    id: "deal-3",
    title: "Diagnostics Fleet Data Stream",
    company: "BioHealth Diagnostics",
    value: 120000,
    stage: "negotiation",
    probability: 90,
    expectedCloseDate: "2026-03-28",
    owner: "Alex Mercer",
    priority: "High",
    tags: ["HIPAA", "Dedicated Support"],
  },
  {
    id: "deal-4",
    title: "Automated Reconciliation Module",
    company: "Fintech Horizon",
    value: 65000,
    stage: "qualified",
    probability: 45,
    expectedCloseDate: "2026-05-12",
    owner: "David Kim",
    priority: "Medium",
    tags: ["Fintech", "Stripe Partner"],
  },
  {
    id: "deal-5",
    title: "Smart Grid Sensor Platform",
    company: "Helios Solar Tech",
    value: 95000,
    stage: "discovery",
    probability: 25,
    expectedCloseDate: "2026-06-01",
    owner: "Alex Mercer",
    priority: "High",
    tags: ["CleanTech", "IoT Integration"],
  },
  {
    id: "deal-6",
    title: "Unified Commerce Engine",
    company: "LuxeRetail Group",
    value: 110000,
    stage: "proposal",
    probability: 70,
    expectedCloseDate: "2026-04-20",
    owner: "Elena Rostova",
    priority: "High",
    tags: ["Retail", "Global Tier"],
  },
  {
    id: "deal-7",
    title: "AI Pipeline Observability",
    company: "NeuralPulse Systems",
    value: 180000,
    stage: "closed-won",
    probability: 100,
    expectedCloseDate: "2026-03-05",
    owner: "Alex Mercer",
    priority: "High",
    tags: ["Annual Prepaid", "Expansion"],
  },
  {
    id: "deal-8",
    title: "Compliance Governance Suite",
    company: "Nordic Heritage Bank",
    value: 135000,
    stage: "closed-won",
    probability: 100,
    expectedCloseDate: "2026-02-28",
    owner: "Elena Rostova",
    priority: "High",
    tags: ["Banking", "Custom SSO"],
  },
  {
    id: "deal-9",
    title: "Branch Network Migration",
    company: "Zenith Retail",
    value: 42000,
    stage: "closed-lost",
    probability: 0,
    expectedCloseDate: "2026-02-15",
    owner: "David Kim",
    priority: "Low",
    tags: ["Budget Deferred"],
  },
];

export const INITIAL_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    company: "NeuralPulse Systems",
    contactName: "Dr. Ethan Hayes",
    contactEmail: "ethan@neuralpulse.ai",
    tier: "Enterprise",
    arr: 180000,
    status: "Active",
    healthScore: 96,
    contractRenewal: "2027-03-05",
    owner: "Alex Mercer",
    industry: "Artificial Intelligence",
  },
  {
    id: "cust-2",
    company: "Nordic Heritage Bank",
    contactName: "Astrid Lindholm",
    contactEmail: "astrid.l@nordicheritage.se",
    tier: "Enterprise",
    arr: 135000,
    status: "Active",
    healthScore: 92,
    contractRenewal: "2027-02-28",
    owner: "Elena Rostova",
    industry: "Financial Services",
  },
  {
    id: "cust-3",
    company: "Kestrel Cyber Labs",
    contactName: "Nathan Drake",
    contactEmail: "nathan@kestrelcyber.com",
    tier: "Growth",
    arr: 68000,
    status: "Active",
    healthScore: 84,
    contractRenewal: "2026-09-14",
    owner: "David Kim",
    industry: "Cybersecurity",
  },
  {
    id: "cust-4",
    company: "Aeris Clean Energy",
    contactName: "Mia Chen",
    contactEmail: "mchen@aerisclean.org",
    tier: "Growth",
    arr: 74000,
    status: "Onboarding",
    healthScore: 88,
    contractRenewal: "2027-01-10",
    owner: "Alex Mercer",
    industry: "Renewable Energy",
  },
  {
    id: "cust-5",
    company: "UrbanStride Mobility",
    contactName: "Carlos Santana",
    contactEmail: "csantana@urbanstride.de",
    tier: "Starter",
    arr: 32000,
    status: "At Risk",
    healthScore: 58,
    contractRenewal: "2026-05-30",
    owner: "David Kim",
    industry: "Transportation",
  },
  {
    id: "cust-6",
    company: "Synthetix Pharma",
    contactName: "Rachel Weisz",
    contactEmail: "r.weisz@synthetix.co.uk",
    tier: "Enterprise",
    arr: 210000,
    status: "Active",
    healthScore: 98,
    contractRenewal: "2026-11-20",
    owner: "Elena Rostova",
    industry: "Healthcare / Life Sciences",
  },
];

export const INITIAL_FOLLOWUPS: FollowUp[] = [
  {
    id: "task-1",
    title: "Executive Demo: Multi-Region Failover Architecture",
    relatedTo: "Apex Global Logistics",
    contact: "Sarah Jenkins (VP Supply Chain)",
    type: "demo",
    dueDate: "2026-03-18",
    priority: "High",
    completed: false,
    notes: "Prepare staging environment with simulated transatlantic latency.",
  },
  {
    id: "task-2",
    title: "Send Redlined Master Services Agreement (MSA)",
    relatedTo: "BioHealth Diagnostics",
    contact: "Julian Brooks",
    type: "proposal-review",
    dueDate: "2026-03-18",
    priority: "High",
    completed: false,
    notes: "Legal approved clause 14 indemnity revisions.",
  },
  {
    id: "task-3",
    title: "Discovery Call: Automated Revenue Sync",
    relatedTo: "Fintech Horizon",
    contact: "Priya Sharma",
    type: "call",
    dueDate: "2026-03-19",
    priority: "Medium",
    completed: false,
    notes: "Focus on automated fee ledger reconciliation.",
  },
  {
    id: "task-4",
    title: "Send Q2 Architecture Whitepaper & Security Addendum",
    relatedTo: "CloudScale Networks",
    contact: "Marcus Vance (CIO)",
    type: "email",
    dueDate: "2026-03-20",
    priority: "Medium",
    completed: false,
    notes: "Include SOC2 Type II report summary.",
  },
  {
    id: "task-5",
    title: "Contract Renewal Check-in & Usage Review",
    relatedTo: "UrbanStride Mobility",
    contact: "Carlos Santana",
    type: "meeting",
    dueDate: "2026-03-21",
    priority: "High",
    completed: false,
    notes: "Customer usage down 14% last month; address team onboarding blockers.",
  },
  {
    id: "task-6",
    title: "Quarterly Business Review (QBR)",
    relatedTo: "NeuralPulse Systems",
    contact: "Dr. Ethan Hayes",
    type: "meeting",
    dueDate: "2026-03-25",
    priority: "Low",
    completed: true,
    notes: "QBR slide deck sent and approved. Renewal expansion discussed.",
  },
];

export const INITIAL_PROPOSALS: Proposal[] = [
  {
    id: "prop-101",
    proposalNumber: "PROP-2026-042",
    title: "Enterprise Logistics Cloud Architecture",
    clientCompany: "Apex Global Logistics",
    clientContact: "Sarah Jenkins",
    amount: 92000,
    status: "Under Review",
    validUntil: "2026-04-15",
    createdDate: "2026-03-10",
    discountPercentage: 10,
  },
  {
    id: "prop-102",
    proposalNumber: "PROP-2026-039",
    title: "Distributed Edge Infrastructure License",
    clientCompany: "CloudScale Networks",
    clientContact: "Marcus Vance",
    amount: 155000,
    status: "Sent",
    validUntil: "2026-04-30",
    createdDate: "2026-03-08",
    discountPercentage: 5,
  },
  {
    id: "prop-103",
    proposalNumber: "PROP-2026-031",
    title: "High-Throughput Diagnostics Stream License",
    clientCompany: "BioHealth Diagnostics",
    clientContact: "Julian Brooks",
    amount: 120000,
    status: "Approved",
    validUntil: "2026-03-31",
    createdDate: "2026-02-27",
    discountPercentage: 0,
  },
  {
    id: "prop-104",
    proposalNumber: "PROP-2026-045",
    title: "Omnichannel Engine & Custom Integration Pack",
    clientCompany: "LuxeRetail Group",
    clientContact: "Chloe Dupont",
    amount: 110000,
    status: "Draft",
    validUntil: "2026-05-01",
    createdDate: "2026-03-15",
    discountPercentage: 8,
  },
  {
    id: "prop-105",
    proposalNumber: "PROP-2026-022",
    title: "Autonomous Fleet Orchestrator Tier 2",
    clientCompany: "Zenith Retail",
    clientContact: "Bradley Shaw",
    amount: 42000,
    status: "Declined",
    validUntil: "2026-02-28",
    createdDate: "2026-01-20",
    discountPercentage: 0,
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "rep-1",
    name: "Alex Mercer",
    role: "Senior Enterprise AE",
    email: "alex.mercer@salesforge.internal",
    avatar: "AM",
    dealsClosed: 14,
    quotaTarget: 1200000,
    quotaAttained: 1410000,
    winRate: 38.5,
    activeDeals: 7,
  },
  {
    id: "rep-2",
    name: "Elena Rostova",
    role: "Strategic Accounts Lead",
    email: "elena.rostova@salesforge.internal",
    avatar: "ER",
    dealsClosed: 18,
    quotaTarget: 1400000,
    quotaAttained: 1565000,
    winRate: 44.0,
    activeDeals: 8,
  },
  {
    id: "rep-3",
    name: "David Kim",
    role: "Mid-Market Account Executive",
    email: "david.kim@salesforge.internal",
    avatar: "DK",
    dealsClosed: 11,
    quotaTarget: 800000,
    quotaAttained: 720000,
    winRate: 31.2,
    activeDeals: 6,
  },
  {
    id: "rep-4",
    name: "Maya Patel",
    role: "Sales Development Rep Lead",
    email: "maya.patel@salesforge.internal",
    avatar: "MP",
    dealsClosed: 24,
    quotaTarget: 600000,
    quotaAttained: 685000,
    winRate: 52.0,
    activeDeals: 11,
  },
];

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "tmpl-1",
    title: "Enterprise Cold Outreach (Value Focused)",
    category: "Cold Outreach",
    subject: "Accelerating {{Company}}'s sales ops by 40%",
    body: `Hi {{First_Name}},

I noticed {{Company}} has been rapidly expanding its sales operations over the last two quarters. Typically when teams scale this fast, data fragmentation between pipeline tracking and sales collateral becomes a friction point.

We recently helped Apex Logistics cut proposal turnaround time by 65% while increasing win rates by 24%.

Would you be open to a brief 12-minute intro this Thursday at 2:00 PM EST to see if our internal sales toolkit could unlock similar gains for your team?

Best regards,
{{Rep_Name}}
{{Rep_Title}}`,
  },
  {
    id: "tmpl-2",
    title: "Post-Demo Recap & Next Steps",
    category: "Follow-up",
    subject: "Recap: Demo & Next Steps for {{Company}}",
    body: `Hi {{First_Name}},

Thank you for your time today! It was great learning more about {{Company}}'s workflow goals around automated pipeline analytics and customized pricing quotes.

As discussed, here are the key highlights and requested resources:
1. Customized Pricing Calculator access link
2. Architecture Overview and SOC2 Type II security report
3. Our tailored 14-day staging pilot sandbox credentials

Our proposed timeline to kick off the pilot is {{Pilot_Date}}. Would next Tuesday work for a quick 20-minute alignment call with your technical lead?

Warm regards,
{{Rep_Name}}`,
  },
  {
    id: "tmpl-3",
    title: "Contract & Proposal Follow-up",
    category: "Contract Closing",
    subject: "{{Company}} - Master Agreement Status Check",
    body: `Hi {{First_Name}},

I'm following up regarding Proposal {{Proposal_Number}} sent on {{Date_Sent}}. 

We've locked in the approved {{Discount_Rate}}% discount tier through {{Expiration_Date}}. If you have any remaining questions from your legal or procurement teams, I'd be happy to hop on a quick bridge to address them directly.

Looking forward to welcoming {{Company}} aboard!

Best,
{{Rep_Name}}`,
  },
  {
    id: "tmpl-4",
    title: "Demo Confirmation & Calendar Invite",
    category: "Demo Confirmation",
    subject: "Confirmed: Sales Toolkit Deep-Dive with {{Company}}",
    body: `Hi {{First_Name}},

Looking forward to our session on {{Meeting_Date_Time}}!

To make the most of our conversation, we will specifically cover:
• Eliminating repetitive manual lead handoffs
• Kanban deals management and auto-calculated probabilities
• Accessing one-click collateral and battlecards in real-time

Here is the direct meeting link: {{Meeting_Link}}

See you soon,
{{Rep_Name}}`,
  },
];

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: "cs-1",
    company: "Apex Global Logistics",
    logoText: "APEX",
    industry: "Logistics & Supply Chain",
    headline: "Reduced deal turnaround from 18 days to 4.5 days with centralized sales assets",
    highlightMetric: "75%",
    metricLabel: "Faster Close Cycle",
    summary:
      "Apex deployed the Internal Sales Toolkit to over 120 global sales reps, enabling instant access to live pricing sheets, proposal templates, and client collateral without bottlenecks.",
    tags: ["Enterprise", "Logistics", "Workflow Automation"],
  },
  {
    id: "cs-2",
    company: "NeuralPulse AI",
    logoText: "NEURAL",
    industry: "Artificial Intelligence",
    headline: "Scaled ARR by $3.8M in 9 months while keeping team size lean",
    highlightMetric: "$3.8M",
    metricLabel: "New ARR Generated",
    summary:
      "By utilizing the live Kanban deal stages and automated follow-up cadences, NeuralPulse closed high-value enterprise accounts with zero missed touches.",
    tags: ["High Growth", "B2B SaaS", "Pipeline Ops"],
  },
  {
    id: "cs-3",
    company: "Synthetix Pharma",
    logoText: "SYNTH",
    industry: "Healthcare & Life Sciences",
    headline: "Achieved 100% compliance adherence across all medical enterprise proposals",
    highlightMetric: "100%",
    metricLabel: "Compliance Score",
    summary:
      "Implemented standardized proposal templates with automated versioning, mitigating legal review delays by 80% across 4 global subsidiaries.",
    tags: ["Healthcare", "Security", "Proposals"],
  },
];

export const RESOURCE_DOCUMENTS: ResourceDocument[] = [
  {
    id: "doc-1",
    title: "Master Enterprise Sales Pitch Deck (Q1 2026)",
    category: "Pitch Deck",
    fileType: "PPTX",
    fileSize: "18.4 MB",
    lastUpdated: "2026-03-01",
    downloadsCount: 342,
  },
  {
    id: "doc-2",
    title: "Global Pricing Matrix & Volume Discount Tiers",
    category: "Pricing Sheet",
    fileType: "XLSX",
    fileSize: "2.1 MB",
    lastUpdated: "2026-03-10",
    downloadsCount: 512,
  },
  {
    id: "doc-3",
    title: "SOC 2 Type II & ISO 27001 Security Overview",
    category: "Security",
    fileType: "PDF",
    fileSize: "4.8 MB",
    lastUpdated: "2026-02-15",
    downloadsCount: 198,
  },
  {
    id: "doc-4",
    title: "Competitor Battlecard: Legacy CRM vs Sales Toolkit",
    category: "Battlecard",
    fileType: "PDF",
    fileSize: "1.6 MB",
    lastUpdated: "2026-03-12",
    downloadsCount: 420,
  },
  {
    id: "doc-5",
    title: "Product Capabilities One-Pager (Executive Edition)",
    category: "One-Pager",
    fileType: "PDF",
    fileSize: "920 KB",
    lastUpdated: "2026-03-05",
    downloadsCount: 680,
  },
];

// Analytics Mock Datasets
export const REVENUE_TREND_DATA = [
  { month: "Oct 2025", revenue: 210000, target: 200000, dealsCount: 14 },
  { month: "Nov 2025", revenue: 245000, target: 220000, dealsCount: 17 },
  { month: "Dec 2025", revenue: 310000, target: 260000, dealsCount: 22 },
  { month: "Jan 2026", revenue: 280000, target: 270000, dealsCount: 19 },
  { month: "Feb 2026", revenue: 340000, target: 290000, dealsCount: 23 },
  { month: "Mar 2026", revenue: 415000, target: 320000, dealsCount: 28 },
];

export const PIPELINE_STAGE_DATA = [
  { name: "Discovery", value: 310000, count: 12, fill: "#6366f1" },
  { name: "Qualified", value: 245000, count: 9, fill: "#8b5cf6" },
  { name: "Proposal", value: 380000, count: 7, fill: "#ec4899" },
  { name: "Negotiation", value: 420000, count: 6, fill: "#f59e0b" },
  { name: "Won (Q1)", value: 580000, count: 14, fill: "#10b981" },
];

export const WIN_LOSS_DATA = [
  { name: "Superior Features", value: 42, color: "#10b981" },
  { name: "Faster Implementation", value: 26, color: "#6366f1" },
  { name: "Better ROI / Pricing", value: 18, color: "#06b6d4" },
  { name: "Competitor Incumbent", value: 9, color: "#f59e0b" },
  { name: "Budget Postponed", value: 5, color: "#ef4444" },
];
