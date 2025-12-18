"use client";

import { useState } from "react";
import { Button } from "@ydtb/ui/base/button";
import { Input } from "@ydtb/ui/base/input";
import { Label } from "@ydtb/ui/base/label";
import { Card, CardContent, CardHeader, CardTitle } from "@ydtb/ui/base/card";
import { Avatar, AvatarFallback } from "@ydtb/ui/base/avatar";
import { Badge } from "@ydtb/ui/base/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@ydtb/ui/base/dialog";
import { Textarea } from "@ydtb/ui/base/textarea";
import { MessageSquare, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { TeamMember, Role } from "./types";
import { ROLE_OPTIONS } from "./constants";

interface TeamMemberFormProps {
  members: TeamMember[];
  onMembersChange: (members: TeamMember[]) => void;
}

export function TeamMemberForm({ members, onMembersChange }: TeamMemberFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("Member");

  // Message Dialog State
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [currentMessage, setCurrentMessage] = useState("");

  const addMember = () => {
    if (firstName && lastName && email) {
      const member: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${firstName} ${lastName}`,
        email: email,
        role: role
      };
      onMembersChange([...members, member]);
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("Member");
    }
  };

  const removeMember = (id: string) => {
    onMembersChange(members.filter(m => m.id !== id));
  };

  const openMessageDialog = (member: TeamMember) => {
    setSelectedMemberId(member.id);
    setCurrentMessage(member.message || "");
    setMessageDialogOpen(true);
  };

  const saveMessage = () => {
    if (selectedMemberId) {
      onMembersChange(members.map(m =>
        m.id === selectedMemberId ? { ...m, message: currentMessage } : m
      ));
      setMessageDialogOpen(false);
      setSelectedMemberId(null);
      setCurrentMessage("");
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle>Invite Team Members</CardTitle>
        <Button
          onClick={addMember}
          className="bg-black text-white hover:bg-slate-800"
          disabled={!firstName || !lastName || !email}
        >
          Add member
        </Button>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Add Member Form */}
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="bg-white"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="bg-white"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="memberEmail">Email</Label>
            <Input
              id="memberEmail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="bg-white"
            />
          </div>

          <div className="grid gap-2">
            <Label>Role</Label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {ROLE_OPTIONS.map((r) => {
                const isSelected = role === r.id;
                return (
                  <div
                    key={r.id}
                    onClick={() => setRole(r.id as Role)}
                    className={cn(
                      "flex flex-col p-4 rounded-lg border-2 cursor-pointer transition-all h-full",
                      isSelected
                        ? "border-black bg-white shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isSelected ? (
                        <div className="h-4 w-4 text-black shrink-0">●</div>
                      ) : (
                        <div className="h-4 w-4 text-slate-300 shrink-0">○</div>
                      )}
                      <span className="font-medium text-sm">{r.label}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pl-6">
                      {r.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Invited Members List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Invited Members</h4>
            <Badge variant="outline" className="text-slate-500">{members.length}</Badge>
          </div>

          {members.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 bg-slate-50/50">
              <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3 text-slate-400">
                <Users className="h-6 w-6" />
              </div>
              <p className="font-medium">No members invited yet</p>
              <p className="text-xs mt-1">Fill out the form above to add people</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {members.map(member => (
                <div key={member.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-indigo-200 transition-colors group">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 border border-slate-100">
                      <AvatarFallback className="bg-indigo-50 text-indigo-600 font-medium">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold text-sm text-slate-900">{member.name}</div>
                      <div className="text-xs text-slate-500">{member.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-slate-200 px-3 mr-2">{member.role}</Badge>

                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 transition-colors",
                        member.message ? "text-indigo-600 bg-indigo-50" : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      )}
                      onClick={() => openMessageDialog(member)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50" onClick={() => removeMember(member.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message Dialog */}
        <Dialog open={messageDialogOpen} onOpenChange={setMessageDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Personal Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Message for {members.find(m => m.id === selectedMemberId)?.name}</Label>
                <Textarea
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Hey, I'd love for you to join our new workspace..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
              <Button onClick={saveMessage}>Save Message</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}