import { useRoute, Link } from "wouter";
import { ChevronRight, Home, Search, Copy, Pencil, X, Check } from "lucide-react";
import DashboardLayout from "~/components/dashboard/Layout";
import { DashboardPageHeader } from "~/components/dashboard/headers/DashboardPageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Mail,
  MessageSquare,
  Phone,
  Video,
  MoreHorizontal,
  Shield,
  Key,
  CreditCard,
  Briefcase,
  Users,
  Database,
  FileText,
  Zap,
  LayoutGrid,
  Image,
  Settings
} from "lucide-react";
import { useState } from "react";

// Mock Data (duplicated from team.tsx for now, ideally would be shared)
const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Sarah Wilson",
    role: "Product Designer",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=1",
    email: "sarah@example.com",
    department: "Design",
    accessLevel: "admin",
    location: "San Francisco, CA",
    joinedDate: "March 2023",
    timezone: "PST (UTC-8)"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Senior Developer",
    status: "busy",
    avatar: "https://i.pravatar.cc/150?u=2",
    email: "michael@example.com",
    department: "Engineering",
    accessLevel: "member",
    location: "New York, NY",
    joinedDate: "January 2022",
    timezone: "EST (UTC-5)"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Product Manager",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?u=3",
    email: "emma@example.com",
    department: "Product",
    accessLevel: "member",
    location: "Austin, TX",
    joinedDate: "June 2023",
    timezone: "CST (UTC-6)"
  },
  {
    id: "4",
    name: "James Kim",
    role: "Marketing Lead",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=4",
    email: "james@example.com",
    department: "Marketing",
    accessLevel: "guest",
    location: "London, UK",
    joinedDate: "September 2023",
    timezone: "GMT (UTC+0)"
  },
  {
    id: "5",
    name: "Alex Turner",
    role: "Frontend Developer",
    status: "away",
    avatar: "https://i.pravatar.cc/150?u=5",
    email: "alex@example.com",
    department: "Engineering",
    accessLevel: "member",
    location: "Remote",
    joinedDate: "November 2023",
    timezone: "EST (UTC-5)"
  }
];

const PERMISSIONS_SCHEMA = [
  {
    id: "dashboard",
    label: "Dashboard",
    description: "Access to main overview and analytics",
    icon: LayoutGrid,
    permissions: [
      { id: "view_dashboard", label: "View Dashboard" },
      { id: "view_analytics", label: "View Analytics" },
      { id: "export_reports", label: "Export Reports" }
    ]
  },
  {
    id: "contacts",
    label: "Contacts",
    description: "Manage customer and lead data",
    icon: Users,
    permissions: [
      { id: "view_contacts", label: "View Contacts" },
      { id: "edit_contacts", label: "Edit Contacts" },
      { id: "delete_contacts", label: "Delete Contacts" },
      { id: "export_contacts", label: "Export Data" }
    ]
  },
  {
    id: "team",
    label: "Team Directory",
    description: "Access to team member information",
    icon: Briefcase,
    permissions: [
      { id: "view_team", label: "View Directory" },
      { id: "invite_members", label: "Invite Members" },
      { id: "manage_roles", label: "Manage Roles" }
    ]
  },
  {
    id: "messages",
    label: "Messages",
    description: "Access to inbox and communication tools",
    icon: MessageSquare,
    permissions: [
      { id: "view_messages", label: "View Messages" },
      { id: "send_messages", label: "Send Messages" },
      { id: "manage_inboxes", label: "Manage Inboxes" }
    ]
  },
  {
    id: "media",
    label: "Media Library",
    description: "Manage files and assets",
    icon: Image,
    permissions: [
      { id: "view_media", label: "View Files" },
      { id: "upload_media", label: "Upload Files" },
      { id: "delete_media", label: "Delete Files" }
    ]
  },
  {
    id: "pages",
    label: "Pages",
    description: "Manage website pages and content",
    icon: FileText,
    permissions: [
      { id: "view_pages", label: "View Pages" },
      { id: "edit_pages", label: "Edit Content" },
      { id: "publish_pages", label: "Publish Changes" }
    ]
  },
  {
    id: "automation",
    label: "Automation",
    description: "Manage workflows and integrations",
    icon: Zap,
    permissions: [
      { id: "view_workflows", label: "View Workflows" },
      { id: "edit_workflows", label: "Edit Workflows" },
      { id: "run_workflows", label: "Run Manually" }
    ]
  },
  {
    id: "settings",
    label: "Settings",
    description: "Global application settings",
    icon: Settings,
    permissions: [
      { id: "view_settings", label: "View Settings" },
      { id: "manage_billing", label: "Manage Billing" },
      { id: "manage_security", label: "Security Settings" }
    ]
  }
];

function EditableField({
  label,
  value,
  onSave,
  isEditable = true
}: {
  label: string,
  value: string,
  onSave: (newValue: string) => void,
  isEditable?: boolean
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);

  const handleSave = () => {
    onSave(currentValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCurrentValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs text-slate-500">{label}</Label>
        <div className="flex items-center gap-2">
          <Input
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') handleCancel();
            }}
            onBlur={handleCancel}
            autoFocus
            className="h-8 text-sm"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleSave}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group relative ${isEditable ? 'cursor-pointer' : ''}`}
      onClick={() => isEditable && setIsEditing(true)}
    >
      <Label className="text-xs text-slate-500">{label}</Label>
      <div className="flex items-center gap-2 mt-0.5 min-h-[24px]">
        <div className="text-sm font-medium">{value}</div>
        {isEditable && (
          <Pencil className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </div>
  );
}

export default function TeamMemberPage() {
  const [match, params] = useRoute("/team/member/:id");
  const memberId = params?.id;
  const initialMember = TEAM_MEMBERS.find(m => m.id === memberId);
  const [member, setMember] = useState(initialMember);
  const [activeTab, setActiveTab] = useState("overview");

  // Update local state when memberId changes
  if (initialMember?.id !== member?.id && initialMember) {
    setMember(initialMember);
  }

  // Mock state for permissions
  const [permissions, setPermissions] = useState<Record<string, boolean>>({
    view_dashboard: true,
    view_analytics: true,
    view_contacts: true,
    edit_contacts: true,
    view_team: true,
    view_messages: true,
    send_messages: true,
    view_media: true,
    upload_media: true,
    view_pages: true
  });

  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [managerDialogOpen, setManagerDialogOpen] = useState(false);
  const [permissionSearchQuery, setPermissionSearchQuery] = useState("");
  const [managerSearchQuery, setManagerSearchQuery] = useState("");
  const [selectedCopyUser, setSelectedCopyUser] = useState<string | null>(null);
  const [selectedManagerId, setSelectedManagerId] = useState<string | null>(null);
  const [manager, setManager] = useState<{ id: string, name: string, avatar?: string } | null>({ id: '99', name: 'John Doe', avatar: '' });

  const filteredCopyMembers = TEAM_MEMBERS.filter(m =>
    member && m.id !== member.id &&
    (m.name.toLowerCase().includes(permissionSearchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(permissionSearchQuery.toLowerCase()))
  );

  const filteredManagerCandidates = TEAM_MEMBERS.filter(m =>
    member && m.id !== member.id &&
    (m.name.toLowerCase().includes(managerSearchQuery.toLowerCase()) ||
      m.role.toLowerCase().includes(managerSearchQuery.toLowerCase()))
  );

  const handleCopyPermissions = () => {
    // In a real app, we would fetch the selected user's permissions and apply them
    // For now, we'll just simulate a successful copy
    setCopyDialogOpen(false);
    // Optional: Add toast notification here
  };

  const handleUpdateManager = () => {
    if (selectedManagerId) {
      const selected = TEAM_MEMBERS.find(m => m.id === selectedManagerId);
      if (selected) {
        setManager({
          id: selected.id,
          name: selected.name,
          avatar: selected.avatar
        });
      }
      setManagerDialogOpen(false);
    }
  };

  const updateMemberField = (field: keyof typeof TEAM_MEMBERS[0], value: string) => {
    if (member) {
      setMember({ ...member, [field]: value });
    }
  };

  const togglePermission = (id: string) => {
    setPermissions(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  if (!member) {
    return <div>Member not found</div>;
  }

  const header = (
    <DashboardPageHeader
      title="Member Profile"
      breadcrumbs={
        <nav className="flex items-center text-sm text-slate-500 dark:text-slate-400">
          <Link href="/">
            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
              <Home className="h-4 w-4" />
            </a>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          <Link href="/team">
            <a className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors font-medium">Team</a>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-slate-400" />
          <span className="font-medium text-slate-900 dark:text-slate-100">{member.name}</span>
        </nav>
      }
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Shield className="h-4 w-4 mr-2" />
            Reset Password
          </Button>
          <Button variant="destructive" size="sm">
            Deactivate User
          </Button>
        </div>
      }
    />
  );

  return (
    <DashboardLayout activeTool="team" header={header}>
      <div className="max-w-5xl mx-auto pb-10">
        {/* Profile Header Card */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24 border-4 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={member.avatar} />
              <AvatarFallback className="text-xl">{member.name.substring(0, 2)}</AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{member.name}</h1>
                  <Badge variant={member.status === 'online' ? 'default' : 'secondary'} className={
                    member.status === 'online' ? 'bg-green-500 hover:bg-green-600' : ''
                  }>
                    {member.status}
                  </Badge>
                </div>
                <p className="text-lg text-slate-500 dark:text-slate-400">{member.role}</p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {member.email}
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  {member.department}
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="capitalize">{member.accessLevel}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message
                </Button>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button size="sm" variant="outline">
                  <Video className="h-4 w-4 mr-2" />
                  Video
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="permissions" className="space-y-6">
          <TabsList className="bg-slate-100 dark:bg-slate-800 p-1">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="permissions">Permissions & Access</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">
                      <Pencil className="h-3 w-3 mr-1.5" />
                      Edit Details
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <EditableField
                        label="Full Name"
                        value={member.name}
                        onSave={(val) => updateMemberField('name', val)}
                      />
                    </div>
                    <div>
                      <EditableField
                        label="Email Address"
                        value={member.email}
                        onSave={(val) => updateMemberField('email', val)}
                      />
                    </div>
                    <div>
                      <EditableField
                        label="Phone"
                        value="+1 (555) 123-4567"
                        onSave={(val) => console.log('Update phone', val)}
                      />
                    </div>
                    <div>
                      <EditableField
                        label="Location"
                        value={member.location || ""}
                        onSave={(val) => updateMemberField('location', val)}
                      />
                    </div>
                    <div>
                      <EditableField
                        label="Timezone"
                        value={member.timezone || ""}
                        onSave={(val) => updateMemberField('timezone', val)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Joined Date</Label>
                      <div className="text-sm font-medium mt-0.5">{member.joinedDate}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department & Role</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-slate-500">Department</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{member.department}</Badge>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-slate-400 hover:text-slate-600">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <EditableField
                        label="Role"
                        value={member.role}
                        onSave={(val) => updateMemberField('role', val)}
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-slate-500">Manager</Label>
                      <Dialog open={managerDialogOpen} onOpenChange={setManagerDialogOpen}>
                        <DialogTrigger asChild>
                          <div className="flex items-center gap-2 mt-1 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 -ml-1.5 rounded-md transition-colors">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={manager?.avatar} />
                              <AvatarFallback>{manager?.name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{manager?.name || "Select Manager"}</span>
                            <Pencil className="h-3 w-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Select Manager</DialogTitle>
                            <DialogDescription>
                              Choose a manager for {member.name}.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <div className="relative mb-4">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                              <Input
                                placeholder="Search team members..."
                                className="pl-9"
                                value={managerSearchQuery}
                                onChange={(e) => setManagerSearchQuery(e.target.value)}
                              />
                            </div>
                            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                              {filteredManagerCandidates.map((m) => (
                                <div
                                  key={m.id}
                                  className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border ${selectedManagerId === m.id
                                      ? 'border-primary bg-primary/5'
                                      : 'border-transparent'
                                    }`}
                                  onClick={() => setSelectedManagerId(m.id)}
                                >
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={m.avatar} />
                                    <AvatarFallback>{m.name.substring(0, 2)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <Label className="text-sm font-medium cursor-pointer block">
                                      {m.name}
                                    </Label>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">{m.role}</p>
                                  </div>
                                  {selectedManagerId === m.id && (
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                  )}
                                </div>
                              ))}
                              {filteredManagerCandidates.length === 0 && (
                                <p className="text-center text-sm text-slate-500 py-4">No members found</p>
                              )}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setManagerDialogOpen(false)}>Cancel</Button>
                            <Button
                              disabled={!selectedManagerId}
                              onClick={handleUpdateManager}
                            >
                              Update Manager
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="permissions">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tool Permissions</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage what tools and features {member.name.split(' ')[0]} can access.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <Copy className="h-3.5 w-3.5 mr-2" />
                        Copy from...
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Copy Permissions</DialogTitle>
                        <DialogDescription>
                          Select a team member to copy permissions from. This will overwrite current settings.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="relative mb-4">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            placeholder="Search team members..."
                            className="pl-9"
                            value={permissionSearchQuery}
                            onChange={(e) => setPermissionSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {filteredCopyMembers.map((m) => (
                            <div
                              key={m.id}
                              className={`flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer border ${selectedCopyUser === m.id
                                  ? 'border-primary bg-primary/5'
                                  : 'border-transparent'
                                }`}
                              onClick={() => setSelectedCopyUser(m.id)}
                            >
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={m.avatar} />
                                <AvatarFallback>{m.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <Label className="text-sm font-medium cursor-pointer block">
                                  {m.name}
                                </Label>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{m.role}</p>
                              </div>
                              {selectedCopyUser === m.id && (
                                <div className="h-2 w-2 rounded-full bg-primary" />
                              )}
                            </div>
                          ))}
                          {filteredCopyMembers.length === 0 && (
                            <p className="text-center text-sm text-slate-500 py-4">No members found</p>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setCopyDialogOpen(false)}>Cancel</Button>
                        <Button
                          disabled={!selectedCopyUser}
                          onClick={handleCopyPermissions}
                        >
                          Apply Permissions
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  <Button size="sm">Save Changes</Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {PERMISSIONS_SCHEMA.map((tool) => (
                  <Card key={tool.id} className="overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-500">
                          <tool.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">{tool.label}</h3>
                          <p className="text-xs text-slate-500">{tool.description}</p>
                        </div>
                      </div>
                      <Switch
                        checked={tool.permissions.every(p => permissions[p.id])}
                        onCheckedChange={(checked) => {
                          const newPerms = { ...permissions };
                          tool.permissions.forEach(p => {
                            newPerms[p.id] = checked;
                          });
                          setPermissions(newPerms);
                        }}
                      />
                    </div>
                    <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {tool.permissions.map((perm) => (
                        <div key={perm.id} className="flex items-center space-x-2">
                          <Switch
                            id={perm.id}
                            checked={permissions[perm.id] || false}
                            onCheckedChange={() => togglePermission(perm.id)}
                            className="scale-90"
                          />
                          <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                            {perm.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Actions performed by this user in the last 30 days.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600 my-1" />
                        <div className="w-px h-full bg-slate-200 dark:bg-slate-800" />
                      </div>
                      <div className="pb-4">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Updated {i % 2 === 0 ? 'Contacts' : 'Design Assets'}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {i === 1 ? 'Just now' : `${i} hours ago`}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
