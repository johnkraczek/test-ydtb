import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Star, 
  Phone, 
  Video, 
  Mail, 
  Paperclip, 
  Smile, 
  Send,
  CheckCircle2,
  Clock,
  Archive,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  Instagram,
  Facebook,
  MessageSquare,
  Reply,
  Forward,
  Info,
  Plus,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Mock Data
const MOCK_THREADS = [
  {
    id: "1",
    contact: {
      name: "Kimberlee Kraczek",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60",
      platform: "instagram"
    },
    lastMessage: "Hahahaha",
    timestamp: "Dec 07",
    unreadCount: 3,
    isRead: false,
    tags: ["Lead"]
  },
  {
    id: "2",
    contact: {
      name: "Andres Contreras-Gras",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&auto=format&fit=crop&q=60",
      platform: "instagram"
    },
    lastMessage: "Group",
    timestamp: "Dec 02",
    unreadCount: 3,
    isRead: false,
    tags: []
  },
  {
    id: "3",
    contact: {
      name: "John Kraczek",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=60",
      platform: "sms"
    },
    lastMessage: "You're welcome! If you need anyth...",
    timestamp: "Nov 30",
    unreadCount: 11,
    isRead: false,
    tags: ["Customer"]
  },
  {
    id: "4",
    contact: {
      name: "Bryan Kerr",
      avatar: "",
      platform: "instagram"
    },
    lastMessage: "Liked a message",
    timestamp: "Nov 23",
    unreadCount: 1,
    isRead: false,
    tags: []
  },
  {
    id: "5",
    contact: {
      name: "João Lino",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60",
      platform: "instagram"
    },
    lastMessage: "We can schedule based on your ti...",
    timestamp: "Nov 16",
    unreadCount: 3,
    isRead: false,
    tags: ["Partner"]
  },
  {
    id: "6",
    contact: {
      name: "Creed Haymond",
      avatar: "",
      platform: "email"
    },
    lastMessage: "Can we make a QR code keychain",
    timestamp: "Nov 10",
    unreadCount: 1,
    isRead: false,
    tags: ["Inquiry"]
  }
];

const MOCK_MESSAGES = [
  {
    id: "m1",
    sender: "Kimberlee Kraczek",
    content: "Download file",
    isFile: true,
    fileType: "image",
    timestamp: "12:15 AM | Instagram page: Your Digital Toolbox",
    isMe: false
  },
  {
    id: "m2",
    sender: "Kimberlee Kraczek",
    content: "Download file",
    isFile: true,
    fileType: "image",
    timestamp: "12:29 AM | Instagram page: Your Digital Toolbox",
    isMe: false
  },
  {
    id: "m3",
    sender: "Kimberlee Kraczek",
    content: "Download file",
    isFile: true,
    fileType: "image",
    timestamp: "12:34 AM | Instagram page: Your Digital Toolbox",
    isMe: false
  },
  {
    id: "m4",
    sender: "Me",
    content: "Download file",
    isFile: true,
    fileType: "image",
    timestamp: "08:29 PM",
    isMe: true
  }
];

// Helper components
const PlatformIcon = ({ platform, className }: { platform: string, className?: string }) => {
  switch (platform) {
    case 'instagram': return <Instagram className={`text-pink-600 ${className}`} />;
    case 'facebook': return <Facebook className={`text-blue-600 ${className}`} />;
    case 'sms': return <MessageSquare className={`text-green-600 ${className}`} />;
    case 'email': return <Mail className={`text-slate-600 ${className}`} />;
    default: return <MessageSquare className={`text-slate-600 ${className}`} />;
  }
};

export default function MessagesPage() {
  const [selectedThreadId, setSelectedThreadId] = useState("1");
  const [messageInput, setMessageInput] = useState("");
  const [responsePlatform, setResponsePlatform] = useState("instagram");
  const [messages, setMessages] = useState(MOCK_MESSAGES);

  const selectedThread = MOCK_THREADS.find(t => t.id === selectedThreadId);

  const handleSend = () => {
    if (!messageInput.trim()) return;

    const newMessage = {
      id: `m${Date.now()}`,
      sender: "Me",
      content: messageInput,
      isFile: false,
      fileType: "",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true,
      platform: responsePlatform
    };

    setMessages([...messages, newMessage]);
    setMessageInput("");
  };

  return (
    <DashboardLayout activeTool="messages" header={<div className="hidden" />}>
      <div className="flex h-full w-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm">
        
        {/* Column 1: Message List (25%) */}
        <div className="w-1/4 min-w-[300px] border-r border-slate-200 dark:border-slate-800 flex flex-col bg-slate-50/30">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-1 mb-4">
              {["Unread", "Recents", "Starred", "All"].map((tab, i) => (
                <Button 
                  key={tab} 
                  variant="ghost" 
                  size="sm" 
                  className={`px-3 h-8 text-xs font-medium ${i === 0 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'text-slate-500'}`}
                >
                  {tab}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search" className="pl-9 h-9 bg-slate-50 dark:bg-slate-800 border-none" />
              </div>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400">
                <Filter className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-9 w-9 text-slate-400">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 mt-3">
              <div className="h-4 w-4 rounded border border-slate-300 dark:border-slate-600" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">12 Results</span>
              <div className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                Latest-All <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {MOCK_THREADS.map((thread) => (
                <div 
                  key={thread.id}
                  className={`p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${selectedThreadId === thread.id ? 'bg-blue-50/50 dark:bg-blue-900/10 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'}`}
                  onClick={() => setSelectedThreadId(thread.id)}
                >
                  <div className="flex gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-slate-200">
                        <AvatarImage src={thread.contact.avatar} />
                        <AvatarFallback>{thread.contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                        <PlatformIcon platform={thread.contact.platform} className="h-3.5 w-3.5" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <span className={`text-sm truncate pr-2 ${thread.unreadCount > 0 ? 'font-semibold text-slate-900 dark:text-slate-100' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                          {thread.contact.name}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{thread.timestamp}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className={`text-xs truncate ${thread.unreadCount > 0 ? 'text-slate-800 dark:text-slate-200 font-medium' : 'text-slate-500'}`}>
                          {thread.lastMessage}
                        </p>
                        {thread.unreadCount > 0 && (
                          <Badge className="ml-2 h-5 min-w-[20px] px-1 flex items-center justify-center bg-blue-500 text-white border-none text-[10px]">
                            {thread.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Column 2: Conversation View (50%) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 min-w-0">
          {selectedThread ? (
            <>
              {/* Conversation Header */}
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="font-semibold text-slate-900 dark:text-slate-100">{selectedThread.contact.name}</h2>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-yellow-500">
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Separator orientation="vertical" className="h-6 mx-2" />
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <ScrollArea className="flex-1 p-6 bg-slate-50/30">
                <div className="flex flex-col gap-6">
                  <div className="flex justify-center">
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                      Dec 7th, 2025
                    </span>
                  </div>
                  
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                      {!msg.isMe && (
                         <Avatar className="h-8 w-8 mt-1 border border-slate-200">
                            <AvatarImage src={selectedThread.contact.avatar} />
                            <AvatarFallback>{msg.sender.charAt(0)}</AvatarFallback>
                          </Avatar>
                      )}
                      
                      <div className={`flex flex-col gap-1 ${msg.isMe ? 'items-end' : 'items-start'}`}>
                         <div className={`p-4 rounded-2xl shadow-sm text-sm ${
                           msg.isMe 
                             ? 'bg-blue-500 text-white rounded-tr-sm' 
                             : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                         }`}>
                           {msg.isFile ? (
                             <div className="flex items-center gap-2 font-medium">
                               <div className={`p-1.5 rounded bg-white/20 ${msg.isMe ? '' : 'text-blue-500'}`}>
                                 <Archive className="h-4 w-4" />
                               </div>
                               {msg.content}
                             </div>
                           ) : (
                             msg.content
                           )}
                         </div>
                         <div className="flex items-center gap-1">
                            <span className="text-[10px] text-slate-400 px-1">
                              {msg.timestamp}
                            </span>
                            {msg.isMe && (
                              <span className="text-[10px] text-slate-400 capitalize">
                                • via {msg.platform || 'instagram'}
                              </span>
                            )}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Response Section */}
              <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                 <div className="flex items-center gap-4 mb-3 px-1">
                    <div className="flex items-center gap-2 text-sm text-slate-500 font-medium w-full">
                       <Tabs value={responsePlatform} onValueChange={setResponsePlatform} className="w-full">
                         <div className="flex items-center justify-between mb-2">
                           <TabsList className="bg-slate-100 dark:bg-slate-800 h-8 p-0.5">
                             <TabsTrigger 
                               value="instagram" 
                               className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                             >
                               <Instagram className="h-3 w-3 mr-1.5 text-pink-600" /> Instagram
                             </TabsTrigger>
                             <TabsTrigger 
                               value="sms" 
                               className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                             >
                               <MessageSquare className="h-3 w-3 mr-1.5 text-green-600" /> SMS
                             </TabsTrigger>
                             <TabsTrigger 
                               value="email" 
                               className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                             >
                               <Mail className="h-3 w-3 mr-1.5 text-slate-600" /> Email
                             </TabsTrigger>
                           </TabsList>

                           <TabsList className="bg-slate-100 dark:bg-slate-800 h-8 p-0.5">
                             <TabsTrigger 
                               value="internal" 
                               className="h-7 text-xs px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
                             >
                               <MessageSquare className="h-3 w-3 mr-1.5 text-orange-500" /> Internal
                             </TabsTrigger>
                           </TabsList>
                         </div>
                         
                         <div className="mb-3 px-1">
                            {/* Removed Page text */}
                         </div>

                         {responsePlatform === 'email' && (
                           <div className="mb-3 space-y-2">
                             <div className="grid grid-cols-2 gap-2">
                               <div className="relative">
                                 <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium z-10">From:</span>
                                 <Select defaultValue="support">
                                   <SelectTrigger className="h-9 pl-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-1 focus:ring-blue-500 w-full">
                                     <SelectValue placeholder="Select email" />
                                   </SelectTrigger>
                                   <SelectContent>
                                     <SelectItem value="support">support@yourdigitaltoolbox.com</SelectItem>
                                     <SelectItem value="info">info@yourdigitaltoolbox.com</SelectItem>
                                     <SelectItem value="john">john@yourdigitaltoolbox.com</SelectItem>
                                   </SelectContent>
                                 </Select>
                               </div>
                               <div className="relative">
                                 <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">CC:</span>
                                 <Input 
                                   placeholder="" 
                                   className="h-9 pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                                 />
                               </div>
                             </div>
                             <div className="relative">
                               <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">Subject:</span>
                               <Input 
                                 placeholder="" 
                                 className="h-9 pl-16 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                               />
                             </div>
                           </div>
                         )}

                         <div className="relative">
                            <Textarea 
                               placeholder={`Type a ${responsePlatform === 'email' ? 'email' : 'message'}...`}
                               className="min-h-[100px] resize-none pr-12 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus-visible:ring-1 focus-visible:ring-blue-500"
                               value={messageInput}
                               onChange={(e) => setMessageInput(e.target.value)}
                            />
                         </div>
                       </Tabs>
                    </div>
                 </div>

                 <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1">
                       <TooltipProvider>
                          <Tooltip>
                             <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                   <Paperclip className="h-4 w-4" />
                                </Button>
                             </TooltipTrigger>
                             <TooltipContent>Attach File</TooltipContent>
                          </Tooltip>
                          <Tooltip>
                             <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                                   <Smile className="h-4 w-4" />
                                </Button>
                             </TooltipTrigger>
                             <TooltipContent>Emoji</TooltipContent>
                          </Tooltip>
                       </TooltipProvider>
                       <span className="text-slate-300 mx-1">|</span>
                       <Button variant="ghost" size="sm" className="h-8 text-slate-500 text-xs">
                          Saved Replies
                       </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                       <Button variant="outline" size="sm" onClick={() => setMessageInput("")}>
                          Clear
                       </Button>
                       <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSend}>
                          Send <Send className="h-3.5 w-3.5" />
                       </Button>
                    </div>
                 </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
               <MessageSquare className="h-12 w-12 mb-4 opacity-20" />
               <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>

        {/* Column 3: Contact Details (25%) */}
        <div className="w-1/4 min-w-[280px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto">
          {selectedThread ? (
             <div className="p-6 space-y-6">
                <div className="flex flex-col items-center text-center">
                   <div className="relative mb-3">
                      <Avatar className="h-20 w-20 border-2 border-white shadow-sm">
                         <AvatarImage src={selectedThread.contact.avatar} />
                         <AvatarFallback className="text-lg bg-slate-100">{selectedThread.contact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm border border-slate-100">
                         <PlatformIcon platform={selectedThread.contact.platform} className="h-4 w-4" />
                      </div>
                   </div>
                   <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100">{selectedThread.contact.name}</h3>
                   <div className="flex items-center gap-2 mt-3">
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                         <Phone className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                         <Mail className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
                         <Video className="h-3.5 w-3.5" />
                      </Button>
                   </div>
                </div>

                <Separator />

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-slate-900">Contact</h4>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronDown className="h-3 w-3" /></Button>
                   </div>
                   
                   <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-3">
                         <Mail className="h-4 w-4 text-slate-400 mt-0.5" />
                         <div className="flex-1 min-w-0">
                            <p className="text-slate-500 text-xs mb-0.5">Email</p>
                            <p className="font-medium truncate">kim@kraczek.com</p>
                         </div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500"><Plus className="h-3 w-3" /></Button>
                      </div>

                      <div className="flex items-start gap-3">
                         <Phone className="h-4 w-4 text-slate-400 mt-0.5" />
                         <div className="flex-1 min-w-0">
                            <p className="text-slate-500 text-xs mb-0.5">Phone</p>
                            <p className="font-medium truncate">+1 (555) 123-4567</p>
                         </div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-500"><Plus className="h-3 w-3" /></Button>
                      </div>

                      <div className="flex items-start gap-3">
                         <User className="h-4 w-4 text-slate-400 mt-0.5" />
                         <div className="flex-1 min-w-0">
                            <p className="text-slate-500 text-xs mb-0.5">Owner (Assigned to)</p>
                            <p className="text-slate-400 italic">Unassigned</p>
                         </div>
                         <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-400"><ChevronDown className="h-3 w-3" /></Button>
                      </div>
                   </div>
                </div>

                <Separator />
                
                <div className="space-y-4">
                   <div className="flex items-center justify-between cursor-pointer group">
                      <h4 className="font-medium text-sm text-slate-900">Tags</h4>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {selectedThread.tags.map(tag => (
                         <Badge key={tag} variant="secondary" className="font-normal bg-slate-100 text-slate-600 hover:bg-slate-200">
                            {tag}
                         </Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-5 text-[10px] px-2 border-dashed border-slate-300">
                         + Add
                      </Button>
                   </div>
                </div>

                <Separator />

                <div className="space-y-4">
                   <div className="flex items-center justify-between cursor-pointer group">
                      <h4 className="font-medium text-sm text-slate-900">Active Automations</h4>
                      <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600" />
                   </div>
                   <p className="text-xs text-slate-400 italic">No active automations running.</p>
                </div>
                
                <Separator />
                
                 <div className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm text-slate-900">DND</h4>
                      <span className="text-xs text-slate-500 font-medium">OFF</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronDown className="h-3 w-3" /></Button>
                   </div>
                   
                   <div className="space-y-3">
                      {["DND All", "DND Calls & Voicemails", "DND Text Messages", "DND Emails", "DND GMB"].map((item) => (
                         <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                             <div className="h-4 w-4 rounded-full border border-slate-300" />
                             <span className="truncate">{item}</span>
                         </div>
                      ))}
                   </div>
                </div>

             </div>
          ) : (
             <div className="p-6 text-center text-slate-400 mt-10">
                <Info className="h-10 w-10 mx-auto mb-3 opacity-20" />
                <p>Select a contact to view details</p>
             </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
