"use client";

import React, { useState } from "react";
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  PieChart as PieChartIcon,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Target,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  REVENUE_TREND_DATA,
  PIPELINE_STAGE_DATA,
  WIN_LOSS_DATA,
  TEAM_MEMBERS,
} from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("q1");

  const repPerformanceData = TEAM_MEMBERS.map((rep) => ({
    name: rep.name.split(" ")[0],
    attained: rep.quotaAttained / 1000,
    target: rep.quotaTarget / 1000,
    winRate: rep.winRate,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sales Performance & Revenue Analytics
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Deep insights into pipeline velocity, conversion funnels, quota pacing, and win reasons.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground font-medium"
          >
            <option value="q1">Q1 2026 (Current Sprint)</option>
            <option value="trailing">Trailing 6 Months</option>
            <option value="ytd">Year-to-Date 2026</option>
          </select>
        </div>
      </div>

      {/* Top Benchmark KPI Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Average Deal Value
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$94,200</div>
            <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +12.4% higher ACV
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sales Cycle Length
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Calendar className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">22.4 Days</div>
            <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> 6.8 days faster
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pipeline Conversion Rate
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <TrendingUp className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">38.2%</div>
            <p className="text-xs text-emerald-500 font-medium mt-1 flex items-center">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +4.5% vs Q4 benchmark
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Net Revenue Retention
            </CardTitle>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Zap className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">126.8%</div>
            <p className="text-xs text-muted-foreground mt-1">Enterprise accounts expanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Row 1 Charts: Revenue Over Time + Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Bar/Line */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Monthly Revenue vs Target Pace
            </CardTitle>
            <CardDescription>Performance comparison of closed ARR against quotas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={REVENUE_TREND_DATA}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, ""]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
                  />
                  <Bar dataKey="revenue" name="Closed Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Quota Target" fill="#94a3b8" radius={[4, 4, 0, 0]} opacity={0.6} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Funnel Pipeline Volume */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Stage Deal Volume ($ USD)
            </CardTitle>
            <CardDescription>Aggregate pipeline capitalization across each stage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={PIPELINE_STAGE_DATA}
                  layout="vertical"
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.15} />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val / 1000}k`}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.8 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`$${Number(val).toLocaleString()}`, "Pipeline"]}
                  />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]}>
                    {PIPELINE_STAGE_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 Charts: Win/Loss Reasons + Rep Attainment */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Win/Loss Reasons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Primary Win Reasons (Customer Survey)
            </CardTitle>
            <CardDescription>Key competitive factors driving client decisions</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-around gap-4">
            <div className="h-[240px] w-full max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={WIN_LOSS_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {WIN_LOSS_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`${val}%`, "Share"]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs w-full sm:w-auto">
              {WIN_LOSS_DATA.map((item) => (
                <div key={item.name} className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-foreground font-medium">{item.name}</span>
                  </div>
                  <span className="font-bold text-muted-foreground">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rep Quota Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold text-foreground">
              Rep Quota Attainment ($k USD)
            </CardTitle>
            <CardDescription>Current quarterly closed quota pacing by AE</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={repPerformanceData}
                  margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.8 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `$${val}k`}
                    tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                      fontSize: "12px",
                    }}
                    formatter={(val: any) => [`$${Number(val) * 1000}`, ""]}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ paddingBottom: 10, fontSize: 11 }}
                  />
                  <Bar dataKey="attained" name="Closed Attained" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" name="Target Quota" fill="#cbd5e1" radius={[4, 4, 0, 0]} opacity={0.5} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
