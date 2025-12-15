"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Building2, Users, Check, X, Mail, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { acceptInvitation, getPendingInvitations } from "@/server/actions/workspace";

interface Step0WelcomeProps {
  onStartNew: () => void;
}

interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  organization?: {
    id: string;
    name: string;
    slug: string;
  };
  role: "owner" | "admin" | "member" | "guest";
  status: "pending" | "accepted" | "rejected" | "expired" | "canceled";
  expiresAt: Date;
  inviterId: string;
  inviter?: {
    id: string;
    name: string;
    email: string;
  } | null;
  createdAt: Date;
}

export function Step0Welcome({ onStartNew }: Step0WelcomeProps) {
  const router = useRouter();
  const [invites, setInvites] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const pendingInvites = await getPendingInvitations();
        setInvites(pendingInvites);
      } catch (error) {
        // Silently handle errors
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, []);

  const handleAccept = async (invitationId: string) => {
    try {
      await acceptInvitation(invitationId);

      // Remove the invitation from the list
      setInvites(invites.filter(i => i.id !== invitationId));

      // Show success toast
      toast.success("Successfully joined the workspace!", {
        description: "You've been added to the team."
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/');
      }, 1000);

    } catch (error) {
      toast.error("Failed to join workspace", {
        description: "Please try again or contact the workspace admin."
      });
    }
  };

  const handleDecline = async (invitationId: string) => {
    // TODO: Implement decline/reject invitation API
    // For now, just remove it from the UI
    setInvites(invites.filter(i => i.id !== invitationId));
    toast.info("Invitation declined");
  };

  const formatRole = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  const formatSentAt = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return "Just now";
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Welcome to AgencyOS</h1>
        <p className="text-lg text-slate-600">How would you like to get started today?</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-stretch max-w-5xl mx-auto">
        {/* Create New Workspace */}
        <div className="flex-1">
          <Card
            className="hover:border-indigo-600 cursor-pointer transition-all hover:shadow-md group h-full border-2"
            onClick={onStartNew}
          >
            <CardContent className="p-8 flex flex-col items-center text-center space-y-6 h-full justify-center min-h-[400px]">
              <div className="h-24 w-24 bg-indigo-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-600 transition-colors duration-300">
                <Building2 className="h-12 w-12 text-indigo-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="space-y-3 max-w-sm">
                <h3 className="font-bold text-2xl">Create New Workspace</h3>
                <p className="text-slate-500 leading-relaxed">
                  Set up a new workspace for your agency or company from scratch. customize your tools, invite your team, and get started in minutes.
                </p>
              </div>
              <Button size="lg" className="w-full max-w-xs bg-indigo-600 hover:bg-indigo-700 mt-auto shadow-lg shadow-indigo-200">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Vertical Divider (Hidden on mobile) */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="w-px h-full bg-slate-200 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-2 py-1 text-slate-400 text-sm font-medium uppercase tracking-wider">
              OR
            </div>
          </div>
        </div>

        {/* Join Existing Team */}
        <div className="flex-1">
          <Card className="h-full border-2 border-slate-200">
            <CardHeader className="text-center pb-2 pt-8">
              <div className="mx-auto h-24 w-24 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
                <Users className="h-12 w-12 text-slate-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Join Existing Team</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-auto max-h-[220px] pr-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-[200px]">
                    <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {invites.length > 0 ? (
                      invites.map((invite) => (
                        <div key={invite.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors flex items-center justify-between group/invite">
                          <div className="flex-1 min-w-0 mr-3">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-slate-900 truncate text-sm">
                                {invite.organization?.name || 'Unknown Workspace'}
                              </h4>
                              <Badge variant="secondary" className="text-[10px] h-4 px-1 shrink-0 font-normal capitalize">
                                {formatRole(invite.role)}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 truncate">
                              <span className="font-medium text-slate-600">
                                {invite.inviter?.name || 'Someone'}
                              </span>
                              <span className="text-slate-300">•</span>
                              <span>{formatSentAt(invite.createdAt)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 shrink-0 opacity-100 sm:opacity-60 sm:group-hover/invite:opacity-100 transition-opacity">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleAccept(invite.id);
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Accept Invitation</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDecline(invite.id);
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Decline Invitation</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[200px] text-center space-y-4 p-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                        <div className="bg-slate-100 p-3 rounded-full">
                          <Mail className="h-6 w-6 text-slate-400" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium text-slate-900">No pending invites</p>
                          <p className="text-xs text-slate-500 max-w-[200px] mx-auto">
                            Check with your workspace admin to ensure they've sent an invitation to your email.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </ScrollArea>

              <div className="mt-6 text-center">
                <p className="text-xs text-slate-400">
                  Looking for an invite? <br /> Check your spam folder or contact support.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}