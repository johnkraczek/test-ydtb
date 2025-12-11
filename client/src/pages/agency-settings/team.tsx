
import { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Shield, 
  Trash2,
  UserCog
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const AGENCY_TEAM = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@agency.com",
    role: "Admin",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    joinedDate: "Jan 15, 2024"
  },
  {
    id: "2",
    name: "Sarah Miller",
    email: "sarah@agency.com",
    role: "User",
    status: "Active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    joinedDate: "Feb 03, 2024"
  },
  {
    id: "3",
    name: "Mike Brown",
    email: "mike@agency.com",
    role: "User",
    status: "Pending",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    joinedDate: "Mar 10, 2024"
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@agency.com",
    role: "User",
    status: "Inactive",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    joinedDate: "Dec 12, 2023"
  }
];

export default function AgencyTeamPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState(AGENCY_TEAM);
  
  // New member form state
  const [newMember, setNewMember] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "User"
  });

  const filteredMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddMember = () => {
    const member = {
      id: Math.random().toString(36).substr(2, 9),
      name: `${newMember.firstName} ${newMember.lastName}`,
      email: newMember.email,
      role: newMember.role,
      status: "Pending",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newMember.firstName}`,
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
    
    setTeamMembers([...teamMembers, member]);
    setIsAddMemberOpen(false);
    setNewMember({ firstName: "", lastName: "", email: "", role: "User" });
    
    toast({
      title: "Invitation Sent",
      description: `An invitation has been sent to ${member.email}.`,
    });
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({
      title: "Member Removed",
      description: "The team member has been removed from the agency.",
      variant: "destructive"
    });
  };

  const handleResendInvite = (email: string) => {
    toast({
      title: "Invitation Resent",
      description: `A new invitation has been sent to ${email}.`,
    });
  };

  return (
    <DashboardLayout 
      mode="agency" 
      activeTool="agency-settings"
      header={
        <DashboardPageHeader 
          title="Team Management" 
          description="Manage who has access to your agency dashboard."
          hideBreadcrumbs={true}
          actions={
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search team members..." 
                  className="pl-9 bg-white dark:bg-slate-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => setIsAddMemberOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </div>
          }
        />
      }
    >
      <div className="max-w-[1200px] mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <CardTitle className="text-lg">Team Members</CardTitle>
                  <CardDescription>
                    {teamMembers.length} active members in your agency
                  </CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 font-medium">Member</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-slate-100">{member.name}</p>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {member.role === 'Admin' ? (
                            <Shield className="h-3.5 w-3.5 text-indigo-500" />
                          ) : (
                            <UserCog className="h-3.5 w-3.5 text-slate-400" />
                          )}
                          <span className={member.role === 'Admin' ? 'font-medium text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}>
                            {member.role}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <Badge 
                          variant="secondary" 
                          className={`font-normal ${
                            member.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400' : 
                            member.status === 'Pending' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400' : 
                            'bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-400'
                          }`}
                        >
                          {member.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {member.joinedDate}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserCog className="h-4 w-4 mr-2" />
                              Edit Role
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => window.location.href = `mailto:${member.email}`}>
                              <Mail className="h-4 w-4 mr-2" />
                              Email Member
                            </DropdownMenuItem>
                            {member.status === 'Pending' && (
                              <DropdownMenuItem onClick={() => handleResendInvite(member.email)}>
                                <Mail className="h-4 w-4 mr-2" />
                                Resend Invite
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => handleRemoveMember(member.id)}>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredMembers.length === 0 && (
                <div className="text-center py-12 text-slate-500">
                  <p>No team members found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Invite a new member to your agency team. They will receive an email invitation.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={newMember.firstName}
                  onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
                  placeholder="John"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={newMember.lastName}
                  onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                placeholder="john.doe@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select 
                value={newMember.role} 
                onValueChange={(value) => setNewMember({ ...newMember, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="User">User</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddMemberOpen(false)}>Cancel</Button>
            <Button onClick={handleAddMember} disabled={!newMember.firstName || !newMember.email}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
