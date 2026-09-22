"use client";

import React, { useState } from "react";
import {
  FolderArchive,
  FileText,
  Copy,
  Check,
  Download,
  Search,
  Sparkles,
  Calculator,
  Shield,
  Layers,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Award,
  Zap,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  EMAIL_TEMPLATES,
  CASE_STUDIES,
  RESOURCE_DOCUMENTS,
  EmailTemplate,
} from "@/lib/mock-data";
import { useSalesStore } from "@/context/sales-store";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function SalesResourcesPage() {
  const { generateAiEmail, backendStatus } = useSalesStore();
  const [activeTab, setActiveTab] = useState("company");
  const [copiedTemplateId, setCopiedTemplateId] = useState<string | null>(null);
  const [templateSearch, setTemplateSearch] = useState("");

  // AI Email Generator State (Connected to backend API)
  const [aiTopic, setAiTopic] = useState("Follow up on enterprise sales demo and quote");
  const [aiSender, setAiSender] = useState("Alex Mercer");
  const [aiRecipient, setAiRecipient] = useState("Sarah Jenkins");
  const [aiStyle, setAiStyle] = useState<"Formal" | "Appreciating" | "Not Satisfied" | "Neutral">("Formal");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedEmailText, setGeneratedEmailText] = useState("");
  const [isAiEmailCopied, setIsAiEmailCopied] = useState(false);

  // Pricing Calculator State
  const [userSeats, setUserSeats] = useState(25);
  const [isAnnualBilling, setIsAnnualBilling] = useState(true);
  const [includeDedicatedSLA, setIncludeDedicatedSLA] = useState(true);
  const [includeCustomSSO, setIncludeCustomSSO] = useState(false);

  // Pricing formula
  const seatBasePrice = 45; // $/seat/month
  const annualDiscount = isAnnualBilling ? 0.8 : 1.0;
  const slaCost = includeDedicatedSLA ? 500 : 0;
  const ssoCost = includeCustomSSO ? 350 : 0;
  const monthlyTotal = Math.round(userSeats * seatBasePrice * annualDiscount + slaCost + ssoCost);
  const annualTotal = monthlyTotal * 12;

  const handleCopyTemplate = (tmpl: EmailTemplate) => {
    navigator.clipboard.writeText(tmpl.body);
    setCopiedTemplateId(tmpl.id);
    toast.success("Email template copied to clipboard!", {
      description: `Subject: "${tmpl.subject}"`,
    });
    setTimeout(() => setCopiedTemplateId(null), 2500);
  };

  const handleDownloadDoc = (docTitle: string, fileType: string) => {
    toast.success(`Preparing ${fileType} download`, {
      description: `"${docTitle}" is ready for offline presentation.`,
    });
  };

  const handleGenerateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiTopic || !aiSender || !aiRecipient) {
      toast.error("Please fill in Topic, Sender, and Recipient");
      return;
    }
    try {
      setIsGenerating(true);
      const emailText = await generateAiEmail({
        topic: aiTopic,
        sender: aiSender,
        recipient: aiRecipient,
        style: aiStyle,
      });
      setGeneratedEmailText(emailText);
      toast.success("AI Outreach Email generated successfully via backend!");
    } catch (err: any) {
      toast.error("Failed to generate email via backend", {
        description: err?.message || "Check backend connection",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyAiEmail = () => {
    if (!generatedEmailText) return;
    navigator.clipboard.writeText(generatedEmailText);
    setIsAiEmailCopied(true);
    toast.success("AI generated email copied to clipboard!");
    setTimeout(() => setIsAiEmailCopied(false), 2500);
  };

  const filteredTemplates = EMAIL_TEMPLATES.filter(
    (t) =>
      t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(templateSearch.toLowerCase()) ||
      t.body.toLowerCase().includes(templateSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sales Resources & Collateral Hub
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Official company pitch, pricing models, case studies, battlecards, and sales templates.
          </p>
        </div>
      </div>

      {/* Main Tabs Container */}
      <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b border-border overflow-x-auto pb-1">
          <TabsList className="h-10 bg-transparent p-0 gap-2">
            <TabsTrigger
              value="company"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 text-xs font-medium"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Company & Pitch
            </TabsTrigger>
            <TabsTrigger
              value="pricing"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 text-xs font-medium"
            >
              <Calculator className="h-3.5 w-3.5 mr-1.5" /> Pricing & Calculator
            </TabsTrigger>
            <TabsTrigger
              value="templates"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 text-xs font-medium"
            >
              <Copy className="h-3.5 w-3.5 mr-1.5" /> Email Outreach Templates
            </TabsTrigger>
            <TabsTrigger
              value="cases"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 text-xs font-medium"
            >
              <Award className="h-3.5 w-3.5 mr-1.5" /> Customer Case Studies
            </TabsTrigger>
            <TabsTrigger
              value="docs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-lg px-4 text-xs font-medium"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5" /> Decks & Documents
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Company Info & Battlecards */}
        <TabsContent value="company" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  30-Second Elevator Pitch
                </CardTitle>
                <CardDescription>
                  Standardized intro for discovery calls and executive networking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm leading-relaxed text-foreground">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-foreground font-medium">
                  &ldquo;SalesToolkit is the internal operating system built for high-growth enterprise revenue teams. We consolidate fragmented deal pipelines, automated proposal delivery, customer health telemetry, and real-time collateral into a single ultra-fast interface — accelerating deal cycles by an average of 45% without CRM clutter.&rdquo;
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                    Core Value Pillars
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold text-xs mb-2">
                        01
                      </div>
                      <p className="font-semibold text-xs">Frictionless Execution</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Zero lag, keyboard-driven navigation, and instant updates.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-xs mb-2">
                        02
                      </div>
                      <p className="font-semibold text-xs">Live Deal Velocity</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Drag-and-drop Kanban with automated revenue probability.
                      </p>
                    </div>

                    <div className="p-3 rounded-lg border border-border bg-card">
                      <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center font-bold text-xs mb-2">
                        03
                      </div>
                      <p className="font-semibold text-xs">Always-Ready Collateral</p>
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Copy pre-vetted outreach and decks straight into calls.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battlecard Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Competitor Kill Points
                </CardTitle>
                <CardDescription>Handling legacy CRM objections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <p className="font-bold text-destructive">Objection: &ldquo;We already have Salesforce&rdquo;</p>
                  <p className="text-muted-foreground">
                    <strong>Response:</strong> &ldquo;SalesToolkit is designed as the internal rep layer that sits on top. While Salesforce handles complex database schemas, our reps close deals 3x faster with instant Kanban, built-in quotes, and real-time collateral.&rdquo;
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <p className="font-bold text-amber-500">Objection: &ldquo;Is security compliant?&rdquo;</p>
                  <p className="text-muted-foreground">
                    <strong>Response:</strong> &ldquo;Yes. SOC2 Type II certified, ISO 27001 accredited, HIPAA BAA ready, with optional self-hosted VPC endpoints.&rdquo;
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 2: Pricing & Calculator */}
        <TabsContent value="pricing" className="space-y-6 pt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Interactive Calculator */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Calculator className="h-4 w-4 text-primary" />
                  Live Deal Quote Calculator
                </CardTitle>
                <CardDescription>
                  Configure rep seat count, billing frequency, and enterprise add-ons on the fly
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span>Number of Sales Rep Seats:</span>
                    <span className="text-primary text-base font-bold">{userSeats} Users</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={userSeats}
                    onChange={(e) => setUserSeats(Number(e.target.value))}
                    className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>5 Seats</span>
                    <span>50 Seats</span>
                    <span>100 Seats</span>
                    <span>150+ Seats</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  {/* Billing Toggle */}
                  <div className="p-3 rounded-xl border border-border bg-card space-y-2">
                    <span className="text-xs font-semibold block">Billing Term</span>
                    <div className="flex rounded-lg bg-muted p-1 text-xs">
                      <button
                        onClick={() => setIsAnnualBilling(true)}
                        className={`flex-1 py-1 rounded-md transition-all ${
                          isAnnualBilling ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                        }`}
                      >
                        Annual (-20%)
                      </button>
                      <button
                        onClick={() => setIsAnnualBilling(false)}
                        className={`flex-1 py-1 rounded-md transition-all ${
                          !isAnnualBilling ? "bg-background text-foreground shadow-xs font-bold" : "text-muted-foreground"
                        }`}
                      >
                        Monthly
                      </button>
                    </div>
                  </div>

                  {/* Add-on 1 */}
                  <div
                    onClick={() => setIncludeDedicatedSLA(!includeDedicatedSLA)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      includeDedicatedSLA ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">99.99% Dedicated SLA</span>
                      <input
                        type="checkbox"
                        checked={includeDedicatedSLA}
                        onChange={() => {}}
                        className="rounded text-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">+$500/mo enterprise guarantee</p>
                  </div>

                  {/* Add-on 2 */}
                  <div
                    onClick={() => setIncludeCustomSSO(!includeCustomSSO)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      includeCustomSSO ? "border-primary bg-primary/5" : "border-border bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold">Custom SAML SSO</span>
                      <input
                        type="checkbox"
                        checked={includeCustomSSO}
                        onChange={() => {}}
                        className="rounded text-primary"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">+$350/mo Okta / Azure AD</p>
                  </div>
                </div>

                {/* Calculation Output Banner */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 to-purple-500/10 border border-primary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-medium text-muted-foreground block">
                      Estimated Client Quote ({isAnnualBilling ? "Billed Annually" : "Billed Monthly"}):
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-foreground">
                        ${monthlyTotal.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">/ month</span>
                    </div>
                    {isAnnualBilling && (
                      <p className="text-[11px] text-emerald-500 font-semibold mt-0.5">
                        Total Annual Contract: ${annualTotal.toLocaleString()} / year (Saves 20%)
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `SalesToolkit Quote for ${userSeats} users: $${monthlyTotal.toLocaleString()}/mo ($${annualTotal.toLocaleString()}/yr with Annual terms). Includes: ${
                          includeDedicatedSLA ? "99.99% SLA, " : ""
                        }${includeCustomSSO ? "Custom SAML SSO" : ""}`
                      );
                      toast.success("Quote summary copied to clipboard!");
                    }}
                    className="text-xs shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5 mr-1.5" />
                    Copy Quote Summary
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Standard Tiers Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-semibold text-foreground">
                  Published Tiers
                </CardTitle>
                <CardDescription>Customer facing subscription tiers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-xs">
                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Starter</span>
                    <Badge variant="secondary">$35/user/mo</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Up to 10 reps, basic Kanban, standard email templates.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-primary/40 bg-primary/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-primary">Growth (Most Popular)</span>
                    <Badge variant="purple">$45/user/mo</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Unlimited reps, live pipeline analytics, proposal builder, custom integrations.
                  </p>
                </div>

                <div className="p-3 rounded-lg border border-border bg-card space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground">Enterprise</span>
                    <Badge variant="outline">Custom Quote</Badge>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Dedicated account manager, 99.99% SLA, SSO, audit logging, custom VPC.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab 3: Email Outreach Templates */}
        <TabsContent value="templates" className="space-y-6 pt-4">
          {/* Live AI Email Generator Connected to Backend */}
          <Card className="border-primary/30 bg-gradient-to-br from-card via-card to-primary/5 shadow-md">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      Live AI Outreach Email Generator
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Powered by the existing FastAPI backend endpoint (<code>/api/v1/email/generate</code>)
                    </CardDescription>
                  </div>
                </div>
                <Badge
                  variant={backendStatus === "connected" ? "success" : "destructive"}
                  className="text-[11px] self-start sm:self-auto"
                >
                  {backendStatus === "connected" ? "API Connected" : "API Offline"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleGenerateEmail} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">
                    Outreach Purpose / Topic Details *
                  </label>
                  <Input
                    placeholder="e.g. Follow up with VP of Operations on enterprise platform architecture demo and pricing terms"
                    value={aiTopic}
                    onChange={(e) => setAiTopic(e.target.value)}
                    className="text-xs"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Sender Name *
                    </label>
                    <Input
                      placeholder="e.g. Alex Mercer"
                      value={aiSender}
                      onChange={(e) => setAiSender(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Recipient Name *
                    </label>
                    <Input
                      placeholder="e.g. Sarah Jenkins"
                      value={aiRecipient}
                      onChange={(e) => setAiRecipient(e.target.value)}
                      className="text-xs"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Tone & Style
                    </label>
                    <select
                      value={aiStyle}
                      onChange={(e) => setAiStyle(e.target.value as any)}
                      className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground font-medium"
                    >
                      <option value="Formal">Formal (Executive B2B)</option>
                      <option value="Appreciating">Appreciating (Post-Meeting Thanks)</option>
                      <option value="Neutral">Neutral (Direct & Concise)</option>
                      <option value="Not Satisfied">Urgent Escalation</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-muted-foreground">
                    Direct integration with Cohere AI model via FastAPI
                  </span>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={isGenerating}
                    className="text-xs font-medium shadow-sm"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                        Generating via Backend...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                        Generate AI Email
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {/* Generated Result Output */}
              {generatedEmailText && (
                <div className="p-4 rounded-xl border border-primary/20 bg-background space-y-3 animate-in fade-in-0 duration-300">
                  <div className="flex items-center justify-between pb-2 border-b border-border/60">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Generated Sales Outreach Draft
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyAiEmail}
                      className="h-7 text-xs text-primary"
                    >
                      {isAiEmailCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                          Copied to Clipboard
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy Draft
                        </>
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-foreground font-mono whitespace-pre-line leading-relaxed max-h-72 overflow-y-auto p-2 bg-muted/20 rounded-lg">
                    {generatedEmailText}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Standard Templates Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between gap-4 mb-4">
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates by keyword or category..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">
              {filteredTemplates.length} battle-tested templates
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((tmpl) => (
              <Card key={tmpl.id} className="hover:border-primary/40 transition-all flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">
                      {tmpl.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyTemplate(tmpl)}
                      className="h-7 text-xs text-primary"
                    >
                      {copiedTemplateId === tmpl.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1 text-emerald-500" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 mr-1" />
                          Copy Text
                        </>
                      )}
                    </Button>
                  </div>
                  <CardTitle className="text-sm font-semibold text-foreground mt-2">
                    {tmpl.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-mono bg-muted/30 p-1.5 rounded text-foreground/80">
                    Subject: {tmpl.subject}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/50 text-xs text-muted-foreground font-mono whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
                    {tmpl.body}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>

        {/* Tab 4: Customer Case Studies */}
        <TabsContent value="cases" className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CASE_STUDIES.map((cs) => (
              <Card key={cs.id} className="flex flex-col justify-between hover:border-primary/40 transition-all">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold tracking-wider text-primary">
                      {cs.logoText}
                    </span>
                    <Badge variant="outline" className="text-[10px]">
                      {cs.industry}
                    </Badge>
                  </div>
                  <CardTitle className="text-sm font-bold text-foreground mt-2 leading-snug">
                    {cs.headline}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Highlight Metric Badge */}
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <span className="text-3xl font-extrabold text-primary block">
                      {cs.highlightMetric}
                    </span>
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                      {cs.metricLabel}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {cs.summary}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2 border-t border-border/50">
                    {cs.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 5: Decks & Documents */}
        <TabsContent value="docs" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-foreground">
                Sales Decks, Whitepapers & Collateral
              </CardTitle>
              <CardDescription>
                Always up-to-date marketing assets, security reviews, and master slide decks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {RESOURCE_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-border bg-card hover:bg-accent/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-xs uppercase">
                      {doc.fileType}
                    </div>
                    <div>
                      <p className="font-semibold text-xs text-foreground">{doc.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {doc.category} • {doc.fileSize} • Updated {doc.lastUpdated}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadDoc(doc.title, doc.fileType)}
                      className="text-xs h-8"
                    >
                      <Download className="h-3.5 w-3.5 mr-1.5" />
                      Download ({doc.fileType})
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
