
import { Bell, Search, Settings, User, ArrowLeft, Plus, Check, ChevronDown, Zap, MessageSquare, LayoutGrid, CheckCircle2, Calculator, Calendar, CreditCard, Smile, Sparkles, FileText, Hash, Mail, Box, Github, Slack, List, AppWindow, Globe, Command as CommandIcon, Image as ImageIcon, Palette, HelpCircle, Phone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DashboardMainHeader() {
  const [workspaces] = useState([
    { id: "1", name: "Acme Corp", plan: "Free Plan", initials: "AC", active: true },
    { id: "2", name: "Stark Industries", plan: "Pro Plan", initials: "SI", active: false },
    { id: "3", name: "Wayne Enterprises", plan: "Enterprise", initials: "WE", active: false },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      title: "New comment on Project Alpha",
      description: "Sarah left a comment on the dashboard design.",
      time: "2 min ago",
      read: false,
      type: "comment"
    },
    {
      id: 2,
      title: "System Update",
      description: "v2.4.0 has been successfully deployed.",
      time: "1 hour ago",
      read: false,
      type: "system"
    },
    {
      id: 3,
      title: "Task Completed",
      description: "Homepage redesign task marked as done.",
      time: "3 hours ago",
      read: true,
      type: "task"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'command' | 'settings'>('command');
  const [settingsTab, setSettingsTab] = useState<'general' | 'sources' | 'commands'>('general');
  const { themeColor, setThemeColor } = useThemeColor();
  const [searchSettings, setSearchSettings] = useState([
    { id: 'contacts', label: 'Contacts', icon: User, enabled: true, description: 'Search through your contacts and team members' },
    { id: 'tasks', label: 'Tasks', icon: CheckCircle2, enabled: true, description: 'Find tasks, subtasks and projects' },
    { id: 'media', label: 'Media', icon: ImageIcon, enabled: true, description: 'Images, videos and other media files' },
    { id: 'docs', label: 'Documents', icon: FileText, enabled: true, description: 'Text documents, PDFs and spreadsheets' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, enabled: false, description: 'Events, meetings and reminders' },
    { id: 'messages', label: 'Messages', icon: MessageSquare, enabled: true, description: 'Chat messages and direct messages' },
    { id: 'channels', label: 'Channels', icon: Hash, enabled: true, description: 'Public and private channels' },
    { id: 'repos', label: 'Repositories', icon: Github, enabled: false, description: 'Code repositories and branches' },
  ]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        if (!open) setView('command'); // Reset to command view when opening
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredWorkspaces = workspaces.filter(ws => 
    ws.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white/80 backdrop-blur-md px-2 sticky top-0 z-50">
      <CommandDialog open={open} onOpenChange={setOpen}>
        {view === 'command' ? (
          <>
            <div className="flex items-center border-b px-3" cmdk-input-wrapper="">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandPrimitive.Input
                className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search, run a command, or ask a question..."
              />
              <Button variant="outline" size="sm" className="h-7 gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:text-indigo-700">
                Ask AI
                <Sparkles className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="flex items-center gap-1 p-2 border-b bg-slate-50/50 overflow-x-auto no-scrollbar">
              <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-medium bg-white shadow-sm border border-slate-200 text-slate-900">
                All
              </Button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
                <Mail className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
                <Box className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
                <Github className="h-3.5 w-3.5" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:text-slate-900 hover:bg-slate-200/50">
                <Slack className="h-3.5 w-3.5" />
              </Button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
                <CheckCircle2 className="h-3 w-3" />
                Tasks
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
                <FileText className="h-3 w-3" />
                Docs
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2 gap-1 text-xs font-medium text-slate-600 hover:bg-slate-200/50 border border-transparent hover:border-slate-200">
                <Hash className="h-3 w-3" />
                Channels
              </Button>
            </div>

            <CommandList className="max-h-[500px]">
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">Connect GHL to Clinic Sense via forms</span>
                        <span className="text-xs text-slate-400 shrink-0">1mo ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>in Tasks</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
                <CommandItem className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <LayoutGrid className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">Phone Process for how to answer a call</span>
                        <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                        <span>in Tasks</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
                <CommandItem className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">Export Contacts to upload to High Level</span>
                        <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                        <span>in Tasks</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
                <CommandItem className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">Obtain Files from Haley, Graphic Designer</span>
                        <span className="text-xs text-slate-400 shrink-0">2mo ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="h-4 w-4 rounded-full bg-indigo-600 text-white text-[10px] flex items-center justify-center">E</span>
                        <span>in Tasks</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Rise AI">
                <CommandItem className="py-3">
                  <div className="flex items-center gap-3 w-full">
                    <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                      <LayoutGrid className="h-4 w-4 text-slate-500" />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-900 truncate">Botanza</span>
                        <span className="text-xs text-slate-400 shrink-0">3mo ago</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>in Rise AI</span>
                      </div>
                    </div>
                  </div>
                </CommandItem>
              </CommandGroup>
            </CommandList>
            
            <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-t text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span>Type <kbd className="font-mono bg-white border rounded px-1">/</kbd> to view available commands</span>
                <span>hit <kbd className="font-mono bg-white border rounded px-1">tab</kbd> on a selected item to see additional actions</span>
              </div>
              <div 
                className="flex items-center gap-1 cursor-pointer hover:text-slate-900"
                onClick={() => setView('settings')}
              >
                <Settings className="h-3 w-3" />
                <span>Settings</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-[625px] w-full bg-white rounded-lg overflow-hidden">
            {/* Sidebar */}
            <div className="w-48 border-r bg-slate-50 p-2 flex flex-col gap-1">
              <div className="px-3 py-2 mb-2 flex items-center gap-2 font-semibold text-sm text-slate-900">
                <Settings className="h-4 w-4" />
                Search settings
              </div>
              
              <button 
                onClick={() => setSettingsTab('general')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                  settingsTab === 'general' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <List className="h-4 w-4" />
                General
              </button>
              <button 
                onClick={() => setSettingsTab('sources')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                  settingsTab === 'sources' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <AppWindow className="h-4 w-4" />
                Sources
              </button>
              <button 
                onClick={() => setSettingsTab('commands')}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors text-left",
                  settingsTab === 'commands' ? "bg-indigo-50 text-indigo-700" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <CommandIcon className="h-4 w-4" />
                Commands
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col h-full">
              <div className="h-14 border-b flex items-center justify-between px-6">
                <h2 className="font-semibold text-slate-900">
                  {settingsTab === 'general' && 'General Settings'}
                  {settingsTab === 'sources' && 'Sources'}
                  {settingsTab === 'commands' && 'Commands'}
                </h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-slate-400 hover:text-slate-600"
                  onClick={() => setView('command')}
                >
                  <span className="sr-only">Close settings</span>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {settingsTab === 'general' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-slate-900 mb-1">Search Scope</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Customize what content appears in your search results.
                      </p>
                    </div>
                    <div className="space-y-4">
                      {searchSettings.map((setting) => (
                        <div key={setting.id} className="flex items-start justify-between group">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-100">
                              <setting.icon className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900 mb-0.5">{setting.label}</div>
                              <div className="text-xs text-slate-500">{setting.description}</div>
                            </div>
                          </div>
                          <Switch 
                            checked={setting.enabled}
                            onCheckedChange={(checked) => {
                              setSearchSettings(prev => prev.map(s => 
                                s.id === setting.id ? { ...s, enabled: checked } : s
                              ));
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {settingsTab === 'sources' && (
                  <div className="flex flex-col h-full items-center justify-center text-center">
                    <div className="relative mb-6">
                      <div className="h-16 w-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                        <div className="flex flex-col gap-1.5 opacity-50">
                          <div className="w-8 h-1 bg-slate-300 rounded-full" />
                          <div className="w-6 h-1 bg-slate-300 rounded-full" />
                          <div className="w-8 h-1 bg-slate-300 rounded-full" />
                        </div>
                      </div>
                      <div className="absolute -right-2 -bottom-2 h-8 w-8 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                        <Search className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="absolute -left-2 -top-2">
                        <Slack className="h-4 w-4 text-slate-400 rotate-12" />
                      </div>
                      <div className="absolute right-6 -top-4">
                        <Box className="h-3 w-3 text-slate-300" />
                      </div>
                    </div>
                    
                    <h3 className="text-sm font-medium text-slate-900 mb-2">Search your Apps</h3>
                    <p className="text-xs text-slate-500 max-w-[360px] mb-6 leading-relaxed">
                      Visit our App Center to connect apps you're using, enable Connected Search for them and we will use those apps as sources for your search.
                    </p>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 h-9 px-4 text-xs font-medium">
                      Connect app
                    </Button>
                  </div>
                )}

                {settingsTab === 'commands' && (
                  <div className="flex flex-col h-full">
                    <div className="flex-1 flex flex-col items-center justify-center text-center mb-8">
                      <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center mb-4 text-slate-400">
                        <span className="font-mono text-xl">⌘</span>
                        <Search className="h-3 w-3 absolute translate-x-3 translate-y-3 bg-white rounded-full p-0.5" />
                      </div>
                      <h3 className="text-sm font-medium text-slate-900 mb-1">No custom commands</h3>
                      <p className="text-xs text-slate-500 max-w-[240px] mb-4">
                        Create, customize and share your custom commands here.
                      </p>
                      <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200 h-9 px-4 text-xs font-medium">
                        Add command
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-medium text-slate-500 mb-3">Quickly create a new command:</h4>
                      
                      <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                        <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                          <div className="rotate-45">
                            <Plus className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-slate-900">Link</span>
                          </div>
                          <p className="text-xs text-slate-500">Create a shortcut for the fastest way to open any webpage or URL.</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                        <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-slate-900">Clipboard</span>
                          </div>
                          <p className="text-xs text-slate-500">Add a text snippet that you can instantly copy and paste from the...</p>
                        </div>
                      </button>

                      <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all group text-left bg-white">
                        <div className="h-8 w-8 rounded-md bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-500 group-hover:text-indigo-600 transition-colors border border-slate-200/50">
                          <Box className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-sm font-medium text-slate-900">Cloud</span>
                          </div>
                          <p className="text-xs text-slate-500">Fully custom, shareable commands that are just JSON endpoints on t...</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CommandDialog>

      {/* Left section - Team Switcher */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 rounded-md transition-all shadow-sm hover:shadow-md h-10 overflow-hidden pr-2">
              <div className="flex h-full w-10 items-center justify-center bg-primary font-bold text-sm text-primary-foreground transition-all">
                AC
              </div>
              <div className="flex flex-col text-left ml-2 mr-2 justify-center">
                <span className="font-semibold text-sm text-slate-800 dark:text-slate-100 leading-none group-hover:text-primary transition-colors">Acme Corp</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <Zap className="h-3 w-3 text-amber-500 fill-amber-500" />
                  <span className="text-slate-500 text-[10px] leading-none">Free Plan</span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[300px] p-0" sideOffset={8}>
            {/* Back to Agency View */}
            <div className="p-2 border-b border-slate-100 dark:border-slate-800">
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-slate-500 hover:text-slate-900 h-9 font-medium">
                <ArrowLeft className="h-4 w-4" />
                Back to Agency View
              </Button>
            </div>

            {/* Search */}
            <div className="p-3 pb-2">
              <div className="relative">
                <Search className="absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input 
                  className="w-full pl-8 h-9 text-sm bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                  placeholder="Find workspace..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Workspaces List */}
            <div className="p-2 max-h-[240px] overflow-y-auto">
              <DropdownMenuLabel className="text-xs text-slate-500 font-medium px-2 py-1.5">
                Your Workspaces
              </DropdownMenuLabel>
              {filteredWorkspaces.length > 0 ? (
                filteredWorkspaces.map((ws) => (
                  <DropdownMenuItem key={ws.id} className="flex items-center gap-3 p-2 cursor-pointer rounded-md">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-md font-bold text-xs text-white ${ws.active ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-slate-600'}`}>
                      {ws.initials}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className={`font-medium text-sm ${ws.active ? 'text-slate-900 dark:text-slate-100' : 'text-slate-600 dark:text-slate-400'}`}>{ws.name}</span>
                      <span className="text-xs text-slate-400">{ws.plan}</span>
                    </div>
                    {ws.active && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No workspaces found
                </div>
              )}
            </div>

            <DropdownMenuSeparator />

            {/* Create Workspace */}
            <div className="p-2">
              <Button className="w-full gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm shadow-primary/20" size="sm">
                <Plus className="h-4 w-4" />
                Create Workspace
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Center section - Search */}
      <div className="mx-8 max-w-md flex-1">
        <div 
          className="relative group cursor-pointer"
          onClick={() => setOpen(true)}
        >
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          <div className="w-full pl-10 h-10 flex items-center bg-slate-50 border border-slate-200 hover:border-indigo-300 text-sm text-slate-500 rounded-lg transition-all">
            Search resources...
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section - Quick Actions and Avatar */}
      <div className="flex items-center gap-3">
        {/* Quick Actions */}
        
        <div className="h-8 w-px bg-slate-200 mx-1" />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative focus-visible:ring-0 focus-visible:ring-offset-0">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0" sideOffset={8}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h3 className="font-semibold text-sm text-slate-900">Notifications</h3>
              <Button variant="ghost" size="sm" className="h-auto p-0 text-xs text-indigo-600 hover:text-indigo-700 hover:bg-transparent font-medium">
                Mark all as read
              </Button>
            </div>
            <div className="max-h-[320px] overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-4 cursor-pointer focus:bg-slate-50 rounded-none border-b border-slate-50 last:border-0">
                  <div className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    notification.type === 'comment' && "bg-blue-100 text-blue-600",
                    notification.type === 'system' && "bg-purple-100 text-purple-600",
                    notification.type === 'task' && "bg-green-100 text-green-600"
                  )}>
                    {notification.type === 'comment' && <MessageSquare className="h-4 w-4" />}
                    {notification.type === 'system' && <LayoutGrid className="h-4 w-4" />}
                    {notification.type === 'task' && <CheckCircle2 className="h-4 w-4" />}
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium leading-none", !notification.read && "text-slate-900", notification.read && "text-slate-600")}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-normal">
                      {notification.description}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {notification.time}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <div className="p-2 border-t border-slate-100 bg-slate-50/50">
              <Button variant="ghost" size="sm" className="w-full text-xs text-slate-600 hover:text-slate-900 h-8">
                View all notifications
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative focus-visible:ring-0 focus-visible:ring-offset-0">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1" sideOffset={8}>
            <DropdownMenuItem className="cursor-pointer rounded-md p-2">
              <FileText className="mr-2 h-4 w-4 text-slate-500" />
              <span>Documentation</span>
            </DropdownMenuItem>
             <DropdownMenuItem className="cursor-pointer rounded-md p-2">
              <MessageSquare className="mr-2 h-4 w-4 text-slate-500" />
              <span>Community Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md p-2">
              <LayoutGrid className="mr-2 h-4 w-4 text-slate-500" />
              <span>Help Center</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md p-2">
              <Mail className="mr-2 h-4 w-4 text-slate-500" />
              <span>Contact Support</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Avatar Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="relative h-9 w-9 rounded-full ring-2 ring-offset-2 ring-transparent hover:ring-indigo-100 transition-all ml-2" variant="ghost">
              <Avatar className="h-9 w-9 border border-slate-200">
                <AvatarImage alt="User" src="https://github.com/shadcn.png" />
                <AvatarFallback className="bg-indigo-50 text-indigo-600">JD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2" forceMount>
            <div className="flex items-center justify-start gap-2 p-2 bg-slate-50 rounded-md mb-1">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-semibold text-sm">John Doe</p>
                <p className="w-[180px] truncate text-muted-foreground text-xs">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <User className="mr-2 h-4 w-4 text-slate-500" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer rounded-md">
              <Settings className="mr-2 h-4 w-4 text-slate-500" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer rounded-md text-rose-600 focus:text-rose-700 focus:bg-rose-50">
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
