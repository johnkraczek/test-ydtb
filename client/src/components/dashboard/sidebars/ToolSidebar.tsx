
import {
  ChevronsLeft,
  ChevronRight,
  Clock,
  Database,
  Folder,
  Settings,
  Star,
  User,
  ArrowUpRight,
  Plus,
  LayoutGrid,
  PieChart,
  CreditCard,
  FileText,
  File,
  Home,
  MessageSquare,
  Instagram,
  Facebook,
  Mail,
  Zap,
  LayoutTemplate,
  Rocket,
  CheckCircle2,
  Circle,
  Palette,
  Bot,
  ArrowRight,
  Monitor,
  EyeOff,
  Globe,
  Briefcase,
  Hash,
  Search,
  Filter,
  MoreHorizontal,
  Pencil,
  Trash,
  Edit,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMedia, FileSystemItem } from "@/context/media-context";
import { Card } from "@/components/ui/card";
import { FileSelectionDialog } from "@/components/media/FileSelectionDialog";
import { Progress } from "@/components/ui/progress";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ToolSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  toolId: string;
}


// Mock users for the dialog
const MOCK_USERS = [
  { id: "1", name: "Sarah Wilson", role: "Product Designer", avatar: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "Michael Chen", role: "Senior Developer", avatar: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Emma Rodriguez", role: "Product Manager", avatar: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "James Kim", role: "Marketing Lead", avatar: "https://i.pravatar.cc/150?u=4" },
  { id: "5", name: "Alex Turner", role: "Frontend Developer", avatar: "https://i.pravatar.cc/150?u=5" },
];

function NewConversationDialog({ children }: { children: React.ReactNode }) {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filteredUsers = MOCK_USERS.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search people..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {filteredUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleUser(user.id)}
              >
                <Checkbox 
                  id={`user-${user.id}`} 
                  checked={selectedUsers.includes(user.id)}
                  onCheckedChange={() => toggleUser(user.id)}
                />
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label 
                    htmlFor={`user-${user.id}`} 
                    className="text-sm font-medium cursor-pointer"
                  >
                    {user.name}
                  </Label>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user.role}</p>
                </div>
              </div>
            ))}
            {filteredUsers.length === 0 && (
              <p className="text-center text-sm text-slate-500 py-4">No users found</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button disabled={selectedUsers.length === 0} onClick={() => setOpen(false)}>
            Start Chat {selectedUsers.length > 0 && `(${selectedUsers.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ToolSidebar({ isOpen, onToggle, toolId }: ToolSidebarProps) {
  const renderToolContent = () => {
    switch (toolId) {
      case "launchpad":
        return <LaunchpadSidebarContent />;
      case "home":
        return <HomeSidebarContent />;
      case "users":
        return <ContactsSidebarContent />;
      case "team":
        return <TeamSidebarContent />;
      case "messages":
        return <MessagesSidebarContent />;
      case "media":
        return <MediaSidebarContent />;
      case "pages":
        return <PagesSidebarContent />;
      case "automation":
        return <AutomationSidebarContent />;
      case "sop":
        return <SopSidebarContent />;
      case "settings":
        return <SettingsSidebarContent />;
      default:
        return <DefaultSidebarContent />;
    }
  };

  const getToolTitle = () => {
    switch (toolId) {
      case "launchpad":
        return "Launchpad";
      case "home":
        return "Dashboard";
      case "users":
        return "Contacts";
      case "team":
        return "Team";
      case "messages":
        return "Messages";
      case "media":
        return "Media";
      case "pages":
        return "Pages";
      case "automation":
        return "Automation";
      case "sop":
        return "SOP Library";
      case "settings":
        return "Settings";
      default:
        return "Menu";
    }
  };

  return (
    <div
      className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl h-full rounded-2xl border border-slate-200/60 dark:border-slate-800 shadow-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isOpen ? "w-64 opacity-100 translate-x-0" : "w-0 opacity-0 -translate-x-4 overflow-hidden border-0 ml-0 p-0"
      }`}
    >
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header with toggle button */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 p-4 min-h-[60px]">
          {isOpen && <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 tracking-tight pl-1">{getToolTitle()}</h3>}
          <Button
            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg ml-auto"
            onClick={onToggle}
            size="sm"
            variant="ghost"
          >
            {isOpen ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Tool-specific content */}
        <div className="flex-1 overflow-hidden">
           <ScrollArea className="h-full p-3">
             <div className="min-w-[200px]">
                {renderToolContent()}
             </div>
           </ScrollArea>
        </div>
        
        {/* Bottom Action */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800">
            {toolId === "media" && (
                <div className="mb-2">
                    <FileSelectionDialog 
                        trigger={
                            <Button className="w-full justify-start gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-sm mb-2" variant="outline">
                                <File className="h-4 w-4" />
                                <span className="font-medium">Select File...</span>
                            </Button>
                        }
                        onSelect={(file) => console.log('Selected file:', file)}
                    />
                </div>
            )}
            
            {toolId === "launchpad" ? (
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-4 border border-primary/10 dark:border-primary/20">
                   <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-slate-900 dark:text-slate-100">
                          <span>Setup Progress</span>
                          <span>50%</span>
                        </div>
                        <Progress value={50} className="h-2 bg-primary/20 dark:bg-primary/30 [&>div]:bg-primary" />
                      </div>
                      
                      <div className="py-1">
                        <p className="text-xs font-medium text-slate-900 dark:text-slate-100">Next: Connect Payments</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                          Set up your payment processor to start accepting orders.
                        </p>
                      </div>

                      <Button className="w-full justify-between bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm h-9">
                        <span className="font-medium text-xs">Next Step</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>
            ) : toolId === "team" ? (
              <NewConversationDialog>
                <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shadow-none">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">New Conversation</span>
                </Button>
              </NewConversationDialog>
            ) : toolId !== "settings" && (
                <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shadow-none">
                    <Plus className="h-4 w-4" />
                    <span className="font-medium">
                    {toolId === "users" ? "Create New Contact" : toolId === "media" ? "Upload File" : "Create New"}
                    </span>
                </Button>
            )}

            {toolId === "media" && (
              <Card className="p-4 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-none shadow-lg mt-4">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium opacity-80">Storage</span>
                      <span className="text-xs font-bold">75%</span>
                  </div>
                  <div className="h-1.5 bg-primary-foreground/20 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-primary-foreground w-[75%]" />
                  </div>
                  <p className="text-xs opacity-80 mb-4">7.5 GB of 10 GB used</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs h-8 bg-primary-foreground/20 hover:bg-primary-foreground/30 border-none text-primary-foreground">
                      Upgrade Plan
                  </Button>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}

function MediaSidebarContent() {
  const { items, currentPath, navigateToFolder, setCurrentPath, setSelectedItems, favoriteItems, toggleFavorite } = useMedia();
  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;

  const FileTreeItem = ({ item, level = 0 }: { item: FileSystemItem, level?: number }) => {
    const hasChildren = items.some(i => i.parentId === item.id);
    const isExpanded = currentPath.some(p => p.id === item.id) || (currentPath.length > 0 && currentPath[0].id === item.id && level === 0);
    
    return (
      <div className="select-none">
        <div 
          className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
            currentFolderId === item.id 
              ? 'bg-primary/10 text-primary font-medium' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
          onClick={() => navigateToFolder(item)}
        >
          {item.type === 'folder' ? (
            <Folder className={`h-4 w-4 ${currentFolderId === item.id ? 'fill-primary/20' : 'text-slate-400'}`} />
          ) : (
            <File className="h-4 w-4 text-slate-400" />
          )}
          <span className="text-sm truncate">{item.name}</span>
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {items
              .filter(i => i.parentId === item.id && i.type === 'folder')
              .map(child => (
                <FileTreeItem key={child.id} item={child} level={level + 1} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
        {favoriteItems.length > 0 && (
            <div className="space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Favorites</div>
                {items
                    .filter(item => favoriteItems.includes(item.id))
                    .map(item => (
                        <ContextMenu key={item.id}>
                            <ContextMenuTrigger>
                                <div 
                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                                        currentFolderId === item.id 
                                        ? 'bg-primary/10 text-primary font-medium' 
                                        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                                    }`}
                                    onClick={() => {
                                        if (item.type === 'folder') {
                                            navigateToFolder(item);
                                        } else {
                                            // Navigate to parent and select item
                                            if (item.parentId) {
                                                const parent = items.find(i => i.id === item.parentId);
                                                if (parent) navigateToFolder(parent);
                                                setSelectedItems([item.id]);
                                            }
                                        }
                                    }}
                                >
                                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    <span className="text-sm truncate">{item.name}</span>
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                                <ContextMenuItem onClick={() => toggleFavorite(item.id)}>
                                    <Star className="mr-2 h-4 w-4" /> Unpin from Favorites
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    ))}
            </div>
        )}

        <div className="space-y-1">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">Folders</div>
            {/* Root - All Files */}
            <div 
                className={`flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors ${
                    currentPath.length === 0 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
                onClick={() => {
                    setCurrentPath([]);
                    setSelectedItems([]);
                }}
            >
                <Home className="h-4 w-4" />
                <span className="text-sm">All Files</span>
            </div>
            
            {/* Tree Structure */}
            {items.filter(i => i.parentId === null).map(item => (
                <FileTreeItem key={item.id} item={item} />
            ))}
        </div>
    </div>
  );
}

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="mb-6">
            <h4 className="mb-2 px-2 font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">{title}</h4>
            <div className="space-y-0.5">
                {children}
            </div>
        </div>
    );
}

function SidebarItem({ icon: Icon, label, badge, active, actions }: { icon: any, label: string, badge?: string, active?: boolean, actions?: React.ReactNode }) {
    return (
        <div className={`group/item flex items-center w-full h-9 rounded-lg px-2.5 font-normal transition-colors ${active ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`}>
            <div className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer">
                <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-slate-400 group-hover/item:text-slate-600 dark:group-hover/item:text-slate-300"}`} />
                <span className="truncate">{label}</span>
            </div>
            {badge && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 ml-2">
                    {badge}
                </Badge>
            )}
            {actions && (
                <div className="opacity-0 group-hover/item:opacity-100 transition-opacity ml-2">
                    {actions}
                </div>
            )}
        </div>
    )
}

function LaunchpadSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Setup Checklist">
        <SidebarItem icon={Palette} label="Customize Theme" badge="Done" />
        <SidebarItem icon={Monitor} label="Customize Mode" badge="Done" />
        <SidebarItem icon={CreditCard} label="Connect Payments" />
        <SidebarItem icon={Mail} label="Connect Email" />
        <SidebarItem icon={Bot} label="Connect AI Provider" />
        <SidebarItem icon={EyeOff} label="Hide Launchpad" />
      </SidebarSection>
      
      <SidebarSection title="Resources">
        <SidebarItem icon={FileText} label="Setup Guide" />
        <SidebarItem icon={MessageSquare} label="Community Support" />
        <SidebarItem icon={ArrowUpRight} label="Video Tutorials" />
      </SidebarSection>
    </div>
  );
}

function HomeSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Workspace">
          <SidebarItem icon={LayoutGrid} label="Overview" active />
          <SidebarItem icon={Clock} label="Recent Activity" badge="3" />
          <SidebarItem icon={Star} label="Favorites" />
      </SidebarSection>
      
      <SidebarSection title="Projects">
          <SidebarItem icon={Folder} label="Q4 Marketing" />
          <SidebarItem icon={Folder} label="Mobile App Redesign" />
          <SidebarItem icon={Folder} label="Internal Dashboard" />
          <Button className="w-full justify-start gap-2 h-8 px-2.5 text-slate-400 hover:text-primary mt-1" variant="ghost">
            <Plus className="h-3 w-3" />
            <span className="text-xs font-medium">Add Project</span>
          </Button>
      </SidebarSection>
    </div>
  );
}


function TeamSidebarContent() {
  const [location, setLocation] = useLocation();

  return (
    <div className="space-y-1">
      <div onClick={() => setLocation("/team")}>
        <SidebarItem 
          icon={User} 
          label="Team Directory" 
          active={location === "/team"} 
        />
      </div>

      <Separator className="my-2 bg-slate-100 dark:bg-slate-800" />
      
      <SidebarSection title="Conversations">
        <div onClick={() => setLocation("/team/chat/general")}>
          <SidebarItem 
            icon={Hash} 
            label="general" 
            active={location === "/team/chat/general"} 
          />
        </div>
        <div onClick={() => setLocation("/team/chat/design")}>
          <SidebarItem 
            icon={Hash} 
            label="design" 
            active={location === "/team/chat/design"} 
            badge="3"
          />
        </div>
        <div onClick={() => setLocation("/team/chat/engineering")}>
          <SidebarItem 
            icon={Hash} 
            label="engineering" 
            active={location === "/team/chat/engineering"} 
          />
        </div>
        <div onClick={() => setLocation("/team/chat/random")}>
          <SidebarItem 
            icon={Hash} 
            label="random" 
            active={location === "/team/chat/random"} 
            badge="5"
          />
        </div>
        <div onClick={() => setLocation("/team/chat/announcements")}>
          <SidebarItem 
            icon={Hash} 
            label="announcements" 
            active={location === "/team/chat/announcements"} 
            badge="1"
          />
        </div>
      </SidebarSection>
      
      <SidebarSection title="Direct Messages">
        <div onClick={() => setLocation("/team/chat/sarah")}>
          <SidebarItem 
            icon={User} 
            label="Sarah Wilson" 
            active={location === "/team/chat/sarah"} 
            badge="1"
          />
        </div>
        <div onClick={() => setLocation("/team/chat/michael")}>
          <SidebarItem 
            icon={User} 
            label="Michael Chen" 
            active={location === "/team/chat/michael"} 
          />
        </div>
        <div onClick={() => setLocation("/team/chat/emma")}>
          <SidebarItem 
            icon={User} 
            label="Emma Rodriguez" 
            active={location === "/team/chat/emma"} 
          />
        </div>
      </SidebarSection>
    </div>
  );
}

function MessagesSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Inboxes">
        <SidebarItem icon={LayoutGrid} label="All Inboxes" active />
        <SidebarItem icon={MessageSquare} label="SMS Messages" />
        <SidebarItem icon={Mail} label="Email Messages" />
        <SidebarItem icon={Instagram} label="Instagram" />
        <SidebarItem icon={Facebook} label="Facebook" />
      </SidebarSection>
      
      <SidebarSection title="Folders">
        <SidebarItem icon={Folder} label="Leads" />
        <SidebarItem icon={Folder} label="Customers" />
        <SidebarItem icon={Folder} label="Support" />
        <SidebarItem icon={Folder} label="Archived" />
      </SidebarSection>
    </div>
  );
}

function ContactsSidebarContent() {
  const [groups, setGroups] = useState([
    { id: '1', name: 'Customers', type: 'fixed' },
    { id: '2', name: 'Partners', type: 'fixed' },
    { id: '3', name: 'Vendors', type: 'fixed' }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'rename'>('create');
  const [editingGroup, setEditingGroup] = useState<{id: string, name: string, type: string} | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [activeTab, setActiveTab] = useState("fixed");
  
  // New state for filters
  const [filters, setFilters] = useState([{ id: '1', field: 'status', operator: 'is', value: '' }]);

  const openCreateDialog = () => {
    setDialogMode('create');
    setEditingGroup(null);
    setNewGroupName("");
    setActiveTab("fixed");
    setFilters([{ id: Date.now().toString(), field: 'status', operator: 'is', value: '' }]);
    setIsDialogOpen(true);
  };

  const openEditDialog = (group: {id: string, name: string, type: string}, mode: 'edit' | 'rename') => {
    setDialogMode(mode);
    setEditingGroup(group);
    setNewGroupName(group.name);
    setActiveTab(group.type);
    if (mode === 'edit') {
        setFilters([{ id: Date.now().toString(), field: 'status', operator: 'is', value: '' }]);
    }
    setIsDialogOpen(true);
  };

  const handleAddFilter = () => {
      setFilters([...filters, { id: Date.now().toString(), field: 'status', operator: 'is', value: '' }]);
  };

  const handleRemoveFilter = (id: string) => {
      if (filters.length > 1) {
          setFilters(filters.filter(f => f.id !== id));
      }
  };
  
  const updateFilter = (id: string, key: 'field' | 'operator' | 'value', val: string) => {
      setFilters(filters.map(f => f.id === id ? { ...f, [key]: val } : f));
  };

  const handleDeleteGroup = (groupId: string) => {
    setGroups(groups.filter(g => g.id !== groupId));
  };

  const handleSaveGroup = () => {
    if (newGroupName.trim()) {
      if (editingGroup) {
        // Edit existing
        setGroups(groups.map(g => g.id === editingGroup.id ? { ...g, name: newGroupName, type: activeTab } : g));
      } else {
        // Create new
        setGroups([...groups, { 
          id: Date.now().toString(), 
          name: newGroupName, 
          type: activeTab 
        }]);
      }
      setNewGroupName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-1">
      <SidebarSection title="Contacts">
        <SidebarItem icon={User} label="All Contacts" active />
        <SidebarItem icon={Star} label="Favorites" badge="5" />
        <SidebarItem icon={Clock} label="Recently Added" />
      </SidebarSection>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-2">
            <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">Groups</h4>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-4 w-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm" onClick={openCreateDialog}>
                        <Plus className="h-3 w-3 text-slate-500" />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>
                          {dialogMode === 'create' ? 'Create New Group' : 
                           dialogMode === 'rename' ? 'Rename Group' : 'Edit Group'}
                        </DialogTitle>
                    </DialogHeader>
                    
                    {dialogMode === 'rename' ? (
                      <div className="py-4 space-y-4">
                         <div className="space-y-2">
                              <Label htmlFor="name">Group Name</Label>
                              <Input 
                                  id="name" 
                                  placeholder="e.g. VIP Clients" 
                                  value={newGroupName}
                                  onChange={(e) => setNewGroupName(e.target.value)}
                              />
                          </div>
                      </div>
                    ) : (
                      <Tabs defaultValue="fixed" value={activeTab} onValueChange={setActiveTab} className="w-full mt-2">
                          <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="fixed" disabled={dialogMode === 'edit' && activeTab === 'smart'}>Fixed Group</TabsTrigger>
                              <TabsTrigger value="smart" disabled={dialogMode === 'edit' && activeTab === 'fixed'}>Smart Group</TabsTrigger>
                          </TabsList>
                          
                          <div className="py-4 space-y-4">
                              <div className="space-y-2">
                                  <Label htmlFor="name">Group Name</Label>
                                  <Input 
                                      id="name" 
                                      placeholder={activeTab === 'fixed' ? "e.g. VIP Clients" : "e.g. High Value Leads"} 
                                      value={newGroupName}
                                      onChange={(e) => setNewGroupName(e.target.value)}
                                  />
                              </div>
                              
                              {activeTab === 'smart' && (
                                  <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-800">
                                      <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                                          <Filter className="h-4 w-4" />
                                          <span>Filters</span>
                                      </div>
                                      <div className="grid gap-2">
                                          {filters.map((filter, index) => (
                                              <div key={filter.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center">
                                                  <Select value={filter.field} onValueChange={(v) => updateFilter(filter.id, 'field', v)}>
                                                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900">
                                                          <SelectValue placeholder="Field" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                          <SelectItem value="status">Status</SelectItem>
                                                          <SelectItem value="tags">Tags</SelectItem>
                                                          <SelectItem value="location">Location</SelectItem>
                                                      </SelectContent>
                                                  </Select>
                                                  <Select value={filter.operator} onValueChange={(v) => updateFilter(filter.id, 'operator', v)}>
                                                      <SelectTrigger className="h-8 text-xs bg-white dark:bg-slate-900">
                                                          <SelectValue placeholder="Operator" />
                                                      </SelectTrigger>
                                                      <SelectContent>
                                                          <SelectItem value="is">is</SelectItem>
                                                          <SelectItem value="is_not">is not</SelectItem>
                                                          <SelectItem value="contains">contains</SelectItem>
                                                      </SelectContent>
                                                  </Select>
                                                  <Input 
                                                      className="h-8 text-xs bg-white dark:bg-slate-900" 
                                                      placeholder="Value..." 
                                                      value={filter.value}
                                                      onChange={(e) => updateFilter(filter.id, 'value', e.target.value)}
                                                  />
                                                  {filters.length > 1 && (
                                                      <Button 
                                                          variant="ghost" 
                                                          size="icon" 
                                                          className="h-8 w-8 text-slate-400 hover:text-red-500"
                                                          onClick={() => handleRemoveFilter(filter.id)}
                                                      >
                                                          <X className="h-4 w-4" />
                                                      </Button>
                                                  )}
                                                  {filters.length === 1 && (
                                                      <div className="w-8" /> 
                                                  )}
                                              </div>
                                          ))}
                                          <Button 
                                              variant="ghost" 
                                              size="sm" 
                                              className="w-full text-xs text-slate-500 h-7 border border-dashed border-slate-300 dark:border-slate-700 mt-2"
                                              onClick={handleAddFilter}
                                          >
                                              <Plus className="h-3 w-3 mr-1" /> Add Filter
                                          </Button>
                                      </div>
                                  </div>
                              )}
                          </div>
                      </Tabs>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveGroup}>
                          {dialogMode === 'create' ? 'Create Group' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        <div className="space-y-0.5">
            {groups.map(group => (
                <SidebarItem 
                    key={group.id} 
                    icon={group.type === 'smart' ? Zap : Folder} 
                    label={group.name} 
                    actions={
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => openEditDialog(group, 'rename')}>
                            <Pencil className="h-3.5 w-3.5 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          {group.type === 'smart' && (
                            <DropdownMenuItem onClick={() => openEditDialog(group, 'edit')}>
                              <Edit className="h-3.5 w-3.5 mr-2" />
                              Edit Rules
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleDeleteGroup(group.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10">
                            <Trash className="h-3.5 w-3.5 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    }
                />
            ))}
        </div>
      </div>
    </div>
  );
}

function PagesSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Site Structure">
        <SidebarItem icon={File} label="All Pages" active />
        <SidebarItem icon={Star} label="Favorites" />
        <SidebarItem icon={Clock} label="Recent" />
      </SidebarSection>
      
      <SidebarSection title="Folders">
        <SidebarItem icon={Folder} label="Landing Pages" />
        <SidebarItem icon={Folder} label="Blog Posts" />
        <SidebarItem icon={Folder} label="Utility Pages" />
        <SidebarItem icon={Folder} label="Legal" />
      </SidebarSection>

      <SidebarSection title="Templates">
        <SidebarItem icon={File} label="Standard Layout" />
        <SidebarItem icon={File} label="Full Width" />
      </SidebarSection>
    </div>
  );
}

function AutomationSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Workflows">
        <SidebarItem icon={Zap} label="All Automations" active />
        <SidebarItem icon={Clock} label="Scheduled" />
        <SidebarItem icon={Star} label="Favorites" />
      </SidebarSection>
      
      <SidebarSection title="Active">
        <SidebarItem icon={Zap} label="New User Onboarding" />
        <SidebarItem icon={Zap} label="Order Processing" />
        <SidebarItem icon={Zap} label="Lead Enrichment" />
      </SidebarSection>

      <SidebarSection title="Drafts">
        <SidebarItem icon={FileText} label="Support Routing" />
        <SidebarItem icon={FileText} label="Daily Summary" />
      </SidebarSection>
    </div>
  );
}

function SopSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="Library">
        <SidebarItem icon={FileText} label="All Documents" active />
        <SidebarItem icon={Star} label="Favorites" />
        <SidebarItem icon={Clock} label="Recently Updated" />
      </SidebarSection>
      
      <SidebarSection title="Departments">
        <SidebarItem icon={Folder} label="Engineering" />
        <SidebarItem icon={Folder} label="Marketing" />
        <SidebarItem icon={Folder} label="Sales" />
        <SidebarItem icon={Folder} label="HR & Admin" />
        <SidebarItem icon={Folder} label="Customer Success" />
      </SidebarSection>

      <SidebarSection title="Resources">
        <SidebarItem icon={Circle} label="Templates" />
        <SidebarItem icon={Circle} label="Archived" />
      </SidebarSection>
    </div>
  );
}

function SettingsSidebarContent() {
  const [location, setLocation] = useLocation();

  return (
    <div className="space-y-1">
      <SidebarSection title="App Settings">
        <div onClick={() => setLocation("/settings/account")}>
          <SidebarItem 
            icon={User} 
            label="Account" 
            active={location === "/settings/account"} 
          />
        </div>
        <div onClick={() => setLocation("/settings/domain")}>
          <SidebarItem 
            icon={Globe} 
            label="Domains" 
            active={location === "/settings/domain"} 
          />
        </div>
        <div onClick={() => setLocation("/settings/billing")}>
          <SidebarItem 
            icon={CreditCard} 
            label="Billing" 
            active={location === "/settings/billing"} 
          />
        </div>
        <SidebarItem icon={Settings} label="General" />
        <SidebarItem icon={Database} label="Data & Privacy" />
      </SidebarSection>
    </div>
  );
}

function DefaultSidebarContent() {
  return (
    <div className="flex h-40 items-center justify-center">
      <p className="text-slate-400 text-sm text-center px-4">Select a tool from the sidebar to view options</p>
    </div>
  );
}
