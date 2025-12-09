
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
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useMedia, FileSystemItem } from "@/context/media-context";
import { Card } from "@/components/ui/card";
import { FileSelectionDialog } from "@/components/media/FileSelectionDialog";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

interface ToolSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  toolId: string;
}

export function ToolSidebar({ isOpen, onToggle, toolId }: ToolSidebarProps) {
  const renderToolContent = () => {
    switch (toolId) {
      case "home":
        return <HomeSidebarContent />;
      case "users":
        return <ContactsSidebarContent />;
      case "messages":
        return <MessagesSidebarContent />;
      case "media":
        return <MediaSidebarContent />;
      case "automation":
        return <AutomationSidebarContent />;
      case "settings":
        return <SettingsSidebarContent />;
      default:
        return <DefaultSidebarContent />;
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
          {isOpen && <h3 className="font-display font-semibold text-slate-900 dark:text-slate-100 tracking-tight pl-1">Explorer</h3>}
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
            <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border-0 shadow-none">
                <Plus className="h-4 w-4" />
                <span className="font-medium">
                  {toolId === "users" ? "Create New Contact" : toolId === "media" ? "Upload File" : "Create New"}
                </span>
            </Button>
            {toolId === "media" && (
              <Card className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-none shadow-lg mt-4">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium opacity-80">Storage</span>
                      <span className="text-xs font-bold">75%</span>
                  </div>
                  <div className="h-1.5 bg-black/20 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-white w-[75%]" />
                  </div>
                  <p className="text-xs opacity-80 mb-4">7.5 GB of 10 GB used</p>
                  <Button size="sm" variant="secondary" className="w-full text-xs h-8 bg-white/20 hover:bg-white/30 border-none text-white">
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

function SidebarItem({ icon: Icon, label, badge, active }: { icon: any, label: string, badge?: string, active?: boolean }) {
    return (
        <Button 
            className={`w-full justify-between group h-9 rounded-lg px-2.5 font-normal ${active ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"}`} 
            variant="ghost"
        >
            <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${active ? "text-primary" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`} />
                <span className="truncate">{label}</span>
            </div>
            {badge && (
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {badge}
                </Badge>
            )}
        </Button>
    )
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
  return (
    <div className="space-y-1">
      <SidebarSection title="Contacts">
        <SidebarItem icon={User} label="All Contacts" active />
        <SidebarItem icon={Star} label="Favorites" badge="5" />
        <SidebarItem icon={Clock} label="Recently Added" />
      </SidebarSection>
      
      <SidebarSection title="Groups">
        <SidebarItem icon={Folder} label="Customers" />
        <SidebarItem icon={Folder} label="Partners" />
        <SidebarItem icon={Folder} label="Vendors" />
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

function SettingsSidebarContent() {
  return (
    <div className="space-y-1">
      <SidebarSection title="App Settings">
        <SidebarItem icon={Settings} label="General" active />
        <SidebarItem icon={User} label="Account" />
        <SidebarItem icon={CreditCard} label="Billing" />
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
