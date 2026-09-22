"use client";

import React from "react";
import {
  Users,
  Award,
  Target,
  Mail,
  Phone,
  CheckCircle,
  TrendingUp,
  Briefcase,
  DollarSign,
  Plus,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TEAM_MEMBERS } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

export default function TeamPage() {
  const totalTeamTarget = TEAM_MEMBERS.reduce((sum, r) => sum + r.quotaTarget, 0);
  const totalTeamAttained = TEAM_MEMBERS.reduce((sum, r) => sum + r.quotaAttained, 0);
  const teamPacing = Math.round((totalTeamAttained / totalTeamTarget) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sales Organization & Quota Roster
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track individual and collective performance, quota attainment, and closed deal volume.
          </p>
        </div>
      </div>

      {/* Aggregate Team Quota Card */}
      <Card className="bg-gradient-to-r from-card via-card to-primary/5 border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="purple" className="text-xs">
                  Q1 2026 Collective Target
                </Badge>
                <span className="text-xs font-semibold text-emerald-500">
                  +{teamPacing - 100}% Above Target
                </span>
              </div>
              <h2 className="text-3xl font-bold text-foreground">
                {formatCurrency(totalTeamAttained)}{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  / {formatCurrency(totalTeamTarget)}
                </span>
              </h2>
              <p className="text-xs text-muted-foreground">
                4 Account Executives actively pacing for enterprise president&apos;s club.
              </p>
            </div>

            <div className="md:w-72 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span>Quota Attained</span>
                <span className="text-primary">{teamPacing}%</span>
              </div>
              <Progress
                value={100}
                indicatorClassName="bg-gradient-to-r from-primary to-emerald-500"
                className="h-3"
              />
              <p className="text-[11px] text-muted-foreground text-right">
                14 days remaining in Quarter
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rep Roster Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {TEAM_MEMBERS.map((rep, idx) => {
          const attainedPercentage = Math.round((rep.quotaAttained / rep.quotaTarget) * 100);
          const isTopPerformer = idx === 1; // Elena

          return (
            <Card
              key={rep.id}
              className={`hover:border-primary/50 transition-all ${
                isTopPerformer ? "border-primary/40 shadow-sm" : ""
              }`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                        {rep.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{rep.name}</CardTitle>
                        {isTopPerformer && (
                          <Badge variant="warning" className="text-[10px] gap-1 px-1.5 py-0">
                            <Award className="h-3 w-3" /> Top Rep
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="text-xs mt-0.5">{rep.role}</CardDescription>
                    </div>
                  </div>

                  <Badge
                    variant={attainedPercentage >= 100 ? "success" : "secondary"}
                    className="text-xs font-bold"
                  >
                    {attainedPercentage}% Quota
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Paced Revenue:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(rep.quotaAttained)} / {formatCurrency(rep.quotaTarget)}
                    </span>
                  </div>
                  <Progress
                    value={Math.min(attainedPercentage, 100)}
                    indicatorClassName={
                      attainedPercentage >= 100
                        ? "bg-emerald-500"
                        : "bg-primary"
                    }
                    className="h-2"
                  />
                </div>

                {/* Key Rep Stats Grid */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-muted/30 border border-border/50 text-center text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Deals Won</span>
                    <span className="font-bold text-foreground text-sm">{rep.dealsClosed}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Win Rate</span>
                    <span className="font-bold text-emerald-500 text-sm">{rep.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Active Pipeline</span>
                    <span className="font-bold text-foreground text-sm">{rep.activeDeals} Deals</span>
                  </div>
                </div>

                {/* Rep Contact & Actions */}
                <div className="flex items-center justify-between pt-1 border-t border-border/40 text-xs">
                  <span className="text-muted-foreground truncate">{rep.email}</span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(rep.email);
                        toast.success(`Copied email for ${rep.name}`);
                      }}
                      className="h-7 text-xs"
                    >
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
