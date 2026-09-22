"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  TrendingUp,
  Users,
  Target,
  ArrowUpRight,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  UserPlus,
  Briefcase,
  Layers,
  Award,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSalesStore } from "@/context/sales-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { REVENUE_TREND_DATA, TEAM_MEMBERS } from "@/lib/mock-data";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "sonner";
import { QuickAddDialog } from "@/components/layout/quick-add-dialog";

export default function DashboardPage() {
  const { leads, deals, followUps, stats, toggleFollowUp } = useSalesStore();
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);

  // Recent leads (top 4)
  const recentLeads = leads.slice(0, 4);

  // Upcoming follow-ups (uncompleted, sorted)
  const upcomingFollowUps = followUps.filter((f) => !f.completed).slice(0, 4);

  // Pipeline distribution calculations
  const stageBreakdown = [
    {
      name: "Discovery",
      deals: deals.filter((d) => d.stage === "discovery"),
      color: "bg-indigo-500",
    },
    {
      name: "Qualified",
      deals: deals.filter((d) => d.stage === "qualified"),
      color: "bg-blue-500",
    },
    {
      name: "Proposal",
      deals: deals.filter((d) => d.stage === "proposal"),
      color: "bg-purple-500",
    },
    {
      name: "Negotiation",
      deals: deals.filter((d) => d.stage === "negotiation"),
      color: "bg-amber-500",
    },
    {
      name: "Closed Won",
      deals: deals.filter((d) => d.stage === "closed-won"),
      color: "bg-emerald-500",
    },
  ];

  const handleToggleTask = (id: string, title: string) => {
    toggleFollowUp(id);
    toast.success("Follow-up task updated", {
      description: `Marked "${title}" as completed.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Greeting & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Sales Command Center
            </h1>
            <Badge variant="purple" className="text-[10px] gap-1 px-2">
              <Sparkles className="h-3 w-3" /> Q1 Active Sprint
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Welcome back, Alex. Your pipeline is up{" "}
            <span className="font-semibold text-emerald-500">+14.8%</span> this month.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="text-xs"
          >
            <Link href="/deals">
              <Layers className="h-3.5 w-3.5 mr-1.5" />
              View Kanban
            </Link>
          </Button>
          <Button
            size="sm"
            onClick={() => setIsQuickAddOpen(true)}
            className="text-xs shadow-md shadow-primary/20"
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Add Lead / Deal
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pipeline Value */}
        <Card className="hover:border-primary/40 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Total Pipeline Value
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(stats.totalPipelineValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-500 font-semibold flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +18.4%
              </span>
              <span className="text-muted-foreground">vs last quarter</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Won Revenue */}
        <Card className="hover:border-emerald-500/40 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Closed Won Revenue
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {formatCurrency(stats.wonThisMonthValue)}
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-emerald-500 font-semibold flex items-center">
                <ArrowUpRight className="h-3.5 w-3.5" /> +$95k
              </span>
              <span className="text-muted-foreground">new ARR closed</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Win Rate & Active Leads */}
        <Card className="hover:border-blue-500/40 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Active Leads Pipeline
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              {stats.activeLeadsCount} Leads
            </div>
            <div className="flex items-center gap-1.5 mt-1 text-xs">
              <span className="text-primary font-semibold">44% Avg Win Rate</span>
              <span className="text-muted-foreground">• 8 in contact</span>
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Quota Progress */}
        <Card className="hover:border-purple-500/40 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Team Quota Attainment
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tracking-tight text-foreground">
              117.5%
            </div>
            <div className="space-y-1.5 mt-2">
              <Progress value={100} indicatorClassName="bg-gradient-to-r from-primary to-purple-500" className="h-2" />
              <p className="text-[11px] text-muted-foreground">
                Target: $1.2M • Actual: $1.41M (Paced for 130%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Pipeline Stage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Revenue vs Target Chart */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Revenue Trajectory vs Target
              </CardTitle>
              <CardDescription>
                Monthly closed revenue performance and quota benchmark ($ USD)
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs font-normal">
              Trailing 6 Months
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={REVENUE_TREND_DATA}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: "currentColor", opacity: 0.6 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 12, fill: "currentColor", opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      fontSize: "12px",
                    }}
                    formatter={(value: any) => [`$${Number(value).toLocaleString()}`, ""]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Closed Revenue"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="target"
                    name="Quota Target"
                    stroke="#94a3b8"
                    strokeDasharray="4 4"
                    strokeWidth={2}
                    fill="transparent"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right 1 Col: Pipeline by Stage Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Deals by Pipeline Stage
            </CardTitle>
            <CardDescription>Active opportunities distributed by sales cycle</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageBreakdown.map((stage) => {
              const totalStageValue = stage.deals.reduce((sum, d) => sum + d.value, 0);
              const percentage = stats.totalPipelineValue > 0
                ? Math.round((totalStageValue / stats.totalPipelineValue) * 100)
                : 0;

              return (
                <div key={stage.name} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${stage.color}`} />
                      <span className="font-medium text-foreground">{stage.name}</span>
                      <span className="text-muted-foreground">({stage.deals.length})</span>
                    </div>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(totalStageValue)}
                    </span>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            <div className="pt-2">
              <Button variant="outline" size="sm" asChild className="w-full text-xs">
                <Link href="/deals">
                  Open Deals Board <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Section: Recent Leads & Upcoming Follow-ups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Recent Inbound & Targeted Leads
              </CardTitle>
              <CardDescription>Newly sourced prospects requiring outreach</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/leads">
                View All ({leads.length}) <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {lead.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-xs text-foreground truncate">
                      {lead.name}
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {lead.title} • {lead.company}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Badge
                    variant={
                      lead.status === "Qualified"
                        ? "success"
                        : lead.status === "Contacted"
                        ? "info"
                        : "default"
                    }
                    className="text-[10px]"
                  >
                    {lead.status}
                  </Badge>
                  <span className="text-xs font-semibold text-foreground">
                    {formatCurrency(lead.dealEstimate)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Follow-ups & Reminders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Upcoming Sales Follow-ups
              </CardTitle>
              <CardDescription>Scheduled calls, demos, and contract reviews</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/follow-ups">
                View All <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingFollowUps.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No pending tasks! You are all caught up.
              </div>
            ) : (
              upcomingFollowUps.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-3 rounded-lg border border-border bg-card hover:bg-accent/40 transition-colors group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      type="button"
                      onClick={() => handleToggleTask(task.id, task.title)}
                      className="mt-0.5 text-muted-foreground hover:text-emerald-500 transition-colors"
                      title="Mark task completed"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                    <div className="min-w-0">
                      <p className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {task.relatedTo} • Due {formatDate(task.dueDate)}
                      </p>
                    </div>
                  </div>

                  <Badge
                    variant={task.priority === "High" ? "destructive" : "secondary"}
                    className="text-[10px] shrink-0 uppercase tracking-wide"
                  >
                    {task.priority}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Collateral & Rep Leaderboard Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Collateral Quick Access */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-card to-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Frequently Used Sales Collateral
            </CardTitle>
            <CardDescription>
              One-click access to battlecards, pricing calculators, and email templates
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href="/resources?tab=templates"
              className="p-3 rounded-xl border border-border bg-background/80 hover:border-primary/50 transition-all group"
            >
              <span className="text-xs font-semibold text-foreground group-hover:text-primary block">
                Cold Outreach Template
              </span>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                40% open rate tested copy
              </span>
            </Link>

            <Link
              href="/resources?tab=pricing"
              className="p-3 rounded-xl border border-border bg-background/80 hover:border-primary/50 transition-all group"
            >
              <span className="text-xs font-semibold text-foreground group-hover:text-primary block">
                Pricing Tier Matrix
              </span>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Volume & enterprise add-ons
              </span>
            </Link>

            <Link
              href="/resources?tab=battlecards"
              className="p-3 rounded-xl border border-border bg-background/80 hover:border-primary/50 transition-all group"
            >
              <span className="text-xs font-semibold text-foreground group-hover:text-primary block">
                Competitor Battlecard
              </span>
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Key objection handling & ROI
              </span>
            </Link>
          </CardContent>
        </Card>

        {/* Top Performer Badge */}
        <Card className="flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Award className="h-4 w-4 text-amber-500" />
              Leaderboard Spotlight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                ER
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Elena Rostova</p>
                <p className="text-xs text-muted-foreground">Strategic Accounts Lead</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-border">
              <span className="text-muted-foreground">Closed Q1:</span>
              <span className="font-bold text-emerald-500">$1,565,000</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Quota Attained:</span>
              <span className="font-semibold text-foreground">111.7%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <QuickAddDialog
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
      />
    </div>
  );
}
