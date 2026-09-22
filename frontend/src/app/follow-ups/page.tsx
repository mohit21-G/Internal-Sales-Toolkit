"use client";

import React, { useState, useMemo } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Phone,
  Mail,
  Video,
  FileText,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useSalesStore } from "@/context/sales-store";
import { FollowUp } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function FollowUpsPage() {
  const { followUps, toggleFollowUp, addFollowUp } = useSalesStore();

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"pending" | "completed" | "all">("pending");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New Follow-up Form
  const [title, setTitle] = useState("");
  const [relatedTo, setRelatedTo] = useState("");
  const [contact, setContact] = useState("");
  const [type, setType] = useState<FollowUp["type"]>("call");
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]);
  const [priority, setPriority] = useState<FollowUp["priority"]>("High");
  const [notes, setNotes] = useState("");

  const filteredTasks = useMemo(() => {
    return followUps.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.relatedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.contact.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter === "all" || task.type === typeFilter;
      const matchesStatus =
        statusFilter === "all"
          ? true
          : statusFilter === "completed"
          ? task.completed
          : !task.completed;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [followUps, searchQuery, typeFilter, statusFilter]);

  const handleToggle = async (id: string, taskTitle: string, isCompleted: boolean) => {
    await toggleFollowUp(id);
    if (!isCompleted) {
      toast.success("Task completed!", {
        description: `Marked "${taskTitle}" as done.`,
      });
    } else {
      toast.info("Task reopened", {
        description: `Marked "${taskTitle}" as pending.`,
      });
    }
  };

  const handleCreateFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !relatedTo) {
      toast.error("Please provide both Task Title and Related Company");
      return;
    }

    await addFollowUp({
      title,
      relatedTo,
      contact: contact || "Primary Stakeholder",
      type,
      dueDate,
      priority,
      notes: notes || "Sales cadence action item.",
    });

    toast.success("Follow-up task scheduled!", {
      description: `${title} - Due ${formatDate(dueDate)}`,
    });

    setTitle("");
    setRelatedTo("");
    setContact("");
    setNotes("");
    setIsAddOpen(false);
  };

  const pendingCount = followUps.filter((f) => !f.completed).length;
  const completedCount = followUps.filter((f) => f.completed).length;

  const getTypeIcon = (taskType: FollowUp["type"]) => {
    switch (taskType) {
      case "call":
        return <Phone className="h-4 w-4 text-emerald-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-sky-500" />;
      case "demo":
        return <Video className="h-4 w-4 text-purple-500" />;
      case "proposal-review":
        return <FileText className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/50">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Follow-ups & Sales Tasks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Ensure no client interaction falls through the cracks.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="text-xs shadow-md">
          <Plus className="h-4 w-4 mr-1.5" />
          Schedule Task
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Pending Actions
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">{pendingCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Completed Touches
              </p>
              <p className="text-2xl font-bold text-emerald-500 mt-1">{completedCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                High Priority Today
              </p>
              <p className="text-2xl font-bold text-destructive mt-1">
                {followUps.filter((f) => !f.completed && f.priority === "High").length}
              </p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
              <AlertCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter and Tab Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks, accounts, contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-xs outline-none text-foreground"
            >
              <option value="all">All Touch Types</option>
              <option value="call">Phone Call</option>
              <option value="email">Email</option>
              <option value="demo">Product Demo</option>
              <option value="proposal-review">Proposal Review</option>
              <option value="meeting">Meeting</option>
            </select>
          </div>

          <div className="flex items-center rounded-lg bg-muted p-1 text-xs font-medium self-start sm:self-auto">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === "pending"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === "completed"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Completed ({completedCount})
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                statusFilter === "all"
                  ? "bg-background text-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Tasks
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Task List Items */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No tasks found in this view.
            </CardContent>
          </Card>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                task.completed
                  ? "border-border/40 bg-muted/20 opacity-70"
                  : "border-border bg-card hover:border-primary/40 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggle(task.id, task.title, task.completed)}
                  className="mt-0.5 text-muted-foreground hover:text-primary transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 fill-emerald-500/20" />
                  ) : (
                    <Circle className="h-5 w-5 hover:text-primary" />
                  )}
                </button>

                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p
                      className={`text-sm font-semibold text-foreground ${
                        task.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {task.title}
                    </p>
                    <Badge
                      variant={
                        task.priority === "High"
                          ? "destructive"
                          : task.priority === "Medium"
                          ? "warning"
                          : "secondary"
                      }
                      className="text-[9px] px-1.5 py-0 uppercase"
                    >
                      {task.priority}
                    </Badge>
                  </div>

                  <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{task.relatedTo}</span>
                    <span>•</span>
                    <span>{task.contact}</span>
                  </p>

                  {task.notes && (
                    <p className="text-xs text-muted-foreground/80 italic bg-muted/40 p-2 rounded-lg mt-1 border border-border/40">
                      &ldquo;{task.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground px-2.5 py-1 rounded-md bg-secondary">
                  {getTypeIcon(task.type)}
                  <span className="capitalize">{task.type.replace("-", " ")}</span>
                </div>

                <div className="text-right text-xs">
                  <span className="text-muted-foreground block text-[10px]">Due Date</span>
                  <span
                    className={`font-semibold ${
                      !task.completed && task.priority === "High"
                        ? "text-destructive"
                        : "text-foreground"
                    }`}
                  >
                    {formatDate(task.dueDate)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Schedule Follow-up Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Sales Follow-up</DialogTitle>
            <DialogDescription>
              Set up a touchpoint, demo, or contract review with a prospect or client.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateFollowUp} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Task Title *</label>
              <Input
                placeholder="e.g. Executive Architecture Demo"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Account / Company *</label>
                <Input
                  placeholder="e.g. Apex Global Logistics"
                  value={relatedTo}
                  onChange={(e) => setRelatedTo(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Stakeholder Contact</label>
                <Input
                  placeholder="e.g. Sarah Jenkins (VP)"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Touch Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="call">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="demo">Demo Session</option>
                  <option value="proposal-review">Proposal Review</option>
                  <option value="meeting">In-Person Meeting</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full h-9 rounded-lg border border-border bg-background px-2.5 text-xs outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Due Date</label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Objective & Meeting Notes</label>
              <textarea
                placeholder="Include agenda, talking points, or prep steps..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full h-20 rounded-lg border border-border bg-background p-2 text-xs outline-none"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Schedule Task</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
