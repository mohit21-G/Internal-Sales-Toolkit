"use client";

import React, { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Sliders,
  Shield,
  Save,
  Check,
  Building,
  DollarSign,
  Globe,
  Sparkles,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function SettingsPage() {
  const [name, setName] = useState("Alex Mercer");
  const [email, setEmail] = useState("alex.mercer@salesforge.internal");
  const [role, setRole] = useState("Senior Enterprise AE");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("America/New_York");

  // Notification Toggles
  const [notifUrgentFollowups, setNotifUrgentFollowups] = useState(true);
  const [notifDealWon, setNotifDealWon] = useState(true);
  const [notifProposalOpened, setNotifProposalOpened] = useState(true);
  const [notifWeeklyDigest, setNotifWeeklyDigest] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile preferences saved successfully!", {
      description: "Changes have been updated across your sales session.",
    });
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Notification settings updated!");
  };

  const handleSavePipeline = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Pipeline stages configuration saved!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Sales Toolkit Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure rep profile, notification cadences, pipeline stages, and global currency.
          </p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="h-10 bg-muted/50 p-1">
          <TabsTrigger value="profile" className="text-xs">
            <User className="h-3.5 w-3.5 mr-1.5" /> Rep Profile
          </TabsTrigger>
          <TabsTrigger value="pipeline" className="text-xs">
            <Sliders className="h-3.5 w-3.5 mr-1.5" /> Pipeline Stages
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs">
            <Bell className="h-3.5 w-3.5 mr-1.5" /> Alerts & Notifications
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-xs">
            <Globe className="h-3.5 w-3.5 mr-1.5" /> Localization
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile */}
        <TabsContent value="profile">
          <Card>
            <form onSubmit={handleSaveProfile}>
              <CardHeader>
                <CardTitle className="text-base">Sales Representative Profile</CardTitle>
                <CardDescription>
                  Your identification details used on outbound proposals and team leaderboards
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Full Name</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Official Title</label>
                    <Input value={role} onChange={(e) => setRole(e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Internal Work Email</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Territory / Region</label>
                    <Input defaultValue="North America - Enterprise East" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Assigned Annual Quota</label>
                    <Input defaultValue="$1,200,000" disabled className="bg-muted" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button type="submit" size="sm">
                  <Save className="h-4 w-4 mr-1.5" /> Save Changes
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Pipeline Stages */}
        <TabsContent value="pipeline">
          <Card>
            <form onSubmit={handleSavePipeline}>
              <CardHeader>
                <CardTitle className="text-base">Sales Pipeline Stages & Default Probabilities</CardTitle>
                <CardDescription>
                  Configure the milestone stages used in the Deals Kanban board
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 max-w-2xl">
                {[
                  { stage: "Discovery Call", prob: "20%", color: "bg-indigo-500" },
                  { stage: "Qualified Prospect", prob: "40%", color: "bg-blue-500" },
                  { stage: "Proposal & Quote Sent", prob: "65%", color: "bg-purple-500" },
                  { stage: "Commercial Negotiation", prob: "85%", color: "bg-amber-500" },
                  { stage: "Closed Won Contract", prob: "100%", color: "bg-emerald-500" },
                  { stage: "Closed Lost / Disqualified", prob: "0%", color: "bg-slate-500" },
                ].map((item, i) => (
                  <div
                    key={item.stage}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-muted-foreground w-4">0{i + 1}</span>
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="font-semibold text-foreground">{item.stage}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground font-mono">{item.prob} default</span>
                      <Badge variant="outline" className="text-[10px]">Active</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button type="submit" size="sm">
                  <Save className="h-4 w-4 mr-1.5" /> Save Pipeline Rules
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications */}
        <TabsContent value="notifications">
          <Card>
            <form onSubmit={handleSaveNotifications}>
              <CardHeader>
                <CardTitle className="text-base">Alerts & Notification Triggers</CardTitle>
                <CardDescription>
                  Choose which pipeline events pop up in the top navbar and send immediate alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-w-xl text-xs">
                <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Urgent Follow-ups Due Today</span>
                    <span className="text-muted-foreground text-[11px]">
                      Alert when high-priority tasks hit their scheduled date
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifUrgentFollowups}
                    onChange={(e) => setNotifUrgentFollowups(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Deal Closed Won Notifications</span>
                    <span className="text-muted-foreground text-[11px]">
                      Broadcast team celebration when an AE closes a deal
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifDealWon}
                    onChange={(e) => setNotifDealWon(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Proposal Viewed by Client</span>
                    <span className="text-muted-foreground text-[11px]">
                      Receive ping when prospect opens a sent quote link
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifProposalOpened}
                    onChange={(e) => setNotifProposalOpened(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-border bg-card cursor-pointer">
                  <div>
                    <span className="font-semibold text-foreground block">Weekly Quota Digest</span>
                    <span className="text-muted-foreground text-[11px]">
                      Email summary of pipeline velocity every Monday morning
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={notifWeeklyDigest}
                    onChange={(e) => setNotifWeeklyDigest(e.target.checked)}
                    className="h-4 w-4 rounded accent-primary cursor-pointer"
                  />
                </label>
              </CardContent>
              <CardFooter className="border-t border-border pt-4">
                <Button type="submit" size="sm">
                  <Save className="h-4 w-4 mr-1.5" /> Save Alerts
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 4: Regional & Display */}
        <TabsContent value="regional">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Display, Timezone & Currencies</CardTitle>
              <CardDescription>
                Configure local formatting for deal values and proposal quotes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Default Pipeline Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none"
                >
                  <option value="USD">USD ($) - United States Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - British Pound</option>
                  <option value="CAD">CAD ($) - Canadian Dollar</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-foreground">Sales Calendar Timezone</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none"
                >
                  <option value="America/New_York">Eastern Time (US & Canada) - EST</option>
                  <option value="America/Chicago">Central Time (US & Canada) - CST</option>
                  <option value="America/Los_Angeles">Pacific Time (US & Canada) - PST</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Europe/Berlin">Central European Time (CET)</option>
                </select>
              </div>
            </CardContent>
            <CardFooter className="border-t border-border pt-4">
              <Button
                size="sm"
                onClick={() => toast.success("Localization preferences saved!")}
              >
                <Save className="h-4 w-4 mr-1.5" /> Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
