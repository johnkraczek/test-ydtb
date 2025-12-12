import { useState } from "react";
import DashboardLayout from "~/components/dashboard/Layout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Link } from "wouter";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Mail,
  MessageSquare,
  Plus,
  Hash,
  Smile,
  Paperclip,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  Briefcase,
  ThumbsUp,
  ThumbsDown,
  Frown,
  Heart,
  Angry,
  LayoutGrid,
  List
} from "lucide-react";
import { useRoute } from "wouter";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { DashboardPageHeader } from "~/components/dashboard/headers/DashboardPageHeader";

// Mock Data
const TEAM_MEMBERS = [
  {
    id: "1",
    name: "Sarah Wilson",
    role: "Product Designer",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=1",
    email: "sarah@example.com",
    department: "Design",
    accessLevel: "admin"
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Senior Developer",
    status: "busy",
    avatar: "https://i.pravatar.cc/150?u=2",
    email: "michael@example.com",
    department: "Engineering",
    accessLevel: "member"
  },
  {
    id: "3",
    name: "Emma Rodriguez",
    role: "Product Manager",
    status: "offline",
    avatar: "https://i.pravatar.cc/150?u=3",
    email: "emma@example.com",
    department: "Product",
    accessLevel: "member"
  },
  {
    id: "4",
    name: "James Kim",
    role: "Marketing Lead",
    status: "online",
    avatar: "https://i.pravatar.cc/150?u=4",
    email: "james@example.com",
    department: "Marketing",
    accessLevel: "guest"
  },
  {
    id: "5",
    name: "Alex Turner",
    role: "Frontend Developer",
    status: "away",
    avatar: "https://i.pravatar.cc/150?u=5",
    email: "alex@example.com",
    department: "Engineering",
    accessLevel: "member"
  }
];

const CHANNELS = [
  { id: "general", name: "general", unread: 0 },
  { id: "design", name: "design", unread: 3 },
  { id: "engineering", name: "engineering", unread: 0 },
  { id: "random", name: "random", unread: 5 },
  { id: "announcements", name: "announcements", unread: 1 }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    senderId: "1",
    content: "Hey everyone! Just pushed the new design updates.",
    timestamp: "10:30 AM",
    date: "Today",
    reactions: [{ emoji: "👍", count: 2 }]
  },
  {
    id: 2,
    senderId: "2",
    content: "Awesome, I'll take a look shortly.",
    timestamp: "10:32 AM",
    date: "Today",
    reactions: []
  },
  {
    id: 3,
    senderId: "5",
    content: "Can we sync about the navigation component later?",
    timestamp: "10:45 AM",
    date: "Today",
    reactions: []
  },
  {
    id: 4,
    senderId: "1",
    content: "Sure! How about 2pm?",
    timestamp: "10:46 AM",
    date: "Today",
    reactions: [{ emoji: "✅", count: 1 }]
  },
  {
    id: 5,
    senderId: "3",
    content: "The new user flow looks great, but we might need to revisit the onboarding steps.",
    timestamp: "4:15 PM",
    date: "Yesterday",
    reactions: [{ emoji: "👀", count: 3 }]
  },
  {
    id: 6,
    senderId: "4",
    content: "Agreed. I have some data from the latest user tests that support this.",
    timestamp: "4:20 PM",
    date: "Yesterday",
    reactions: []
  },
  {
    id: 7,
    senderId: "1",
    content: "Thanks for the feedback! Let's discuss this in tomorrow's standup.",
    timestamp: "4:30 PM",
    date: "Yesterday",
    reactions: [{ emoji: "🙌", count: 2 }]
  },
  {
    id: 8,
    senderId: "2",
    content: "Has anyone seen the bug report for the checkout page?",
    timestamp: "11:00 AM",
    date: "Yesterday",
    reactions: []
  },
  {
    id: 9,
    senderId: "5",
    content: "Yeah, I'm looking into it now. Seems like a state management issue.",
    timestamp: "11:05 AM",
    date: "Yesterday",
    reactions: [{ emoji: "🐛", count: 1 }]
  },
  {
    id: 10,
    senderId: "3",
    content: "Don't forget the all-hands meeting starting in 10 mins!",
    timestamp: "9:50 AM",
    date: "Last Week",
    reactions: [{ emoji: "⏰", count: 4 }, { emoji: "🏃‍♂️", count: 2 }]
  },
  {
    id: 11,
    senderId: "1",
    content: "On my way!",
    timestamp: "9:52 AM",
    date: "Last Week",
    reactions: []
  },
  {
    id: 12,
    senderId: "4",
    content: "I'll be joining remotely.",
    timestamp: "9:55 AM",
    date: "Last Week",
    reactions: [{ emoji: "👍", count: 1 }]
  },
  {
    id: 13,
    senderId: "2",
    content: "Just deployed the hotfix for the login issue.",
    timestamp: "3:30 PM",
    date: "Last Week",
    reactions: [{ emoji: "🔥", count: 5 }, { emoji: "🚀", count: 3 }]
  },
  {
    id: 14,
    senderId: "5",
    content: "Great work! Getting positive feedback already.",
    timestamp: "3:45 PM",
    date: "Last Week",
    reactions: []
  },
  {
    id: 15,
    senderId: "3",
    content: "Who is handling the release notes for this version?",
    timestamp: "4:00 PM",
    date: "Last Week",
    reactions: []
  }
];

export default function TeamPage() {
  const [match, params] = useRoute("/team/chat/:chatId");
  const isChatView = match;
  const chatId = params?.chatId;

  let header = null;

  if (isChatView && chatId) {
    const isChannel = CHANNELS.find(c => c.id === chatId);
    const isDirectMessage = !isChannel;
    const dmUser = isDirectMessage ? TEAM_MEMBERS[0] : null;

    header = (
      <DashboardPageHeader
        hideBreadcrumbs
        title={
          <div className="flex items-center gap-3">
            {isChannel ? (
              <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <Hash className="h-5 w-5 text-slate-500" />
              </div>
            ) : (
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={dmUser?.avatar} />
                  <AvatarFallback>{dmUser?.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-green-500" />
              </div>
            )}

            <div className="flex flex-col">
              <div className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {isChannel ? chatId : dmUser?.name}
                {isChannel && <Badge variant="outline" className="text-[10px] h-4 font-normal">Channel</Badge>}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                {isChannel ? `${TEAM_MEMBERS.length} members` : dmUser?.role}
              </p>
            </div>
          </div>
        }
        actions={
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
              <Video className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        }
      />
    );
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<'grid' | 'list'>('grid');

  if (!isChatView) {
    header = (
      <DashboardPageHeader
        hideBreadcrumbs
        title={
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">Team Directory</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm font-normal">
              {TEAM_MEMBERS.length} active members in your organization
            </p>
          </div>
        }
        actions={
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search..."
                className="pl-9 bg-white dark:bg-slate-900 h-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* View Selector */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 h-9">
              <button
                onClick={() => setView('grid')}
                className={`p-1 rounded-md transition-all ${view === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                title="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-1 rounded-md transition-all ${view === 'list'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                title="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button size="sm" className="h-9">
              <Plus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </div>
        }
      />
    );
  }

  return (
    <DashboardLayout activeTool="team" header={header}>
      {isChatView && chatId ? (
        <ChatView chatId={chatId} />
      ) : (
        <TeamDirectory searchQuery={searchQuery} view={view} />
      )}
    </DashboardLayout>
  );
}

function TeamDirectory({ searchQuery, view }: { searchQuery: string, view: 'grid' | 'list' }) {
  const filteredMembers = TEAM_MEMBERS.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto w-full">
      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMembers.map((member) => (
            <Link key={member.id} href={`/team/member/${member.id}`}>
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-md transition-shadow cursor-pointer block">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900 ${member.status === 'online' ? 'bg-green-500' :
                          member.status === 'busy' ? 'bg-red-500' :
                            member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                        }`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{member.name}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{member.role}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-normal">
                    {member.department}
                  </Badge>
                  {member.accessLevel === 'admin' && (
                    <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                      Admin
                    </Badge>
                  )}
                  {member.accessLevel === 'guest' && (
                    <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-700">
                      Guest
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={(e) => { e.preventDefault(); /* Open chat logic */ }}>
                    <MessageSquare className="h-3.5 w-3.5 mr-2" />
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 h-8 text-xs" onClick={(e) => { e.preventDefault(); /* Open email logic */ }}>
                    <Mail className="h-3.5 w-3.5 mr-2" />
                    Email
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase text-slate-500 font-medium">
                <tr>
                  <th className="px-4 py-3 font-medium">Member</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Department</th>
                  <th className="px-4 py-3 font-medium">Access</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/team/member/${member.id}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-slate-900 dark:text-slate-100">{member.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{member.role}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="font-normal bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {member.department}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {member.accessLevel === 'admin' && (
                        <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                          Admin
                        </Badge>
                      )}
                      {member.accessLevel === 'member' && (
                        <span className="text-slate-600 dark:text-slate-400 text-sm">Member</span>
                      )}
                      {member.accessLevel === 'guest' && (
                        <Badge variant="outline" className="text-slate-500 border-slate-200 dark:border-slate-700">
                          Guest
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${member.status === 'online' ? 'bg-green-500' :
                            member.status === 'busy' ? 'bg-red-500' :
                              member.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                        <span className="capitalize text-slate-600 dark:text-slate-400">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <Mail className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function ChatView({ chatId }: { chatId: string }) {
  const isChannel = CHANNELS.find(c => c.id === chatId);
  const isDirectMessage = !isChannel; // Simplified logic

  // Mock data for DM user if it's a DM
  const dmUser = isDirectMessage ? TEAM_MEMBERS[0] : null;

  const [messages, setMessages] = useState(INITIAL_MESSAGES);

  const addReaction = (messageId: number, emoji: string) => {
    setMessages(msgs => msgs.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const REACTION_OPTIONS = [
    { emoji: "👍", icon: ThumbsUp, label: "Thumbs Up" },
    { emoji: "👎", icon: ThumbsDown, label: "Thumbs Down" },
    { emoji: "😀", icon: Smile, label: "Smile" },
    { emoji: "😢", icon: Frown, label: "Cry" },
    { emoji: "😠", icon: Angry, label: "Angry" },
    { emoji: "❤️", icon: Heart, label: "Heart" },
  ];

  // Group messages by date
  const groupedMessages = messages.reduce((acc, message) => {
    const date = message.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(message);
    return acc;
  }, {} as Record<string, typeof messages>);

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-6">
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="space-y-6">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-4 sticky top-0 z-10">
                <div className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs text-slate-500 font-medium shadow-sm backdrop-blur-sm bg-opacity-90">
                  {date}
                </div>
              </div>

              {msgs.map((msg) => {
                const sender = TEAM_MEMBERS.find(m => m.id === msg.senderId);
                const isMe = msg.senderId === "1"; // Mock "Me" user

                return (
                  <div key={msg.id} className={`flex gap-3 group ${isMe ? 'flex-row-reverse' : ''}`}>
                    <Avatar className="h-8 w-8 mt-1">
                      <AvatarImage src={sender?.avatar} />
                      <AvatarFallback>{sender?.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>

                    <div className={`flex flex-col gap-1 max-w-[70%] ${isMe ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{sender?.name}</span>
                        <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                      </div>

                      <div className="relative group/message">
                        <div className={`p-3 rounded-2xl text-sm ${isMe
                            ? 'bg-primary text-primary-foreground rounded-tr-sm'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-sm'
                          }`}>
                          {msg.content}
                        </div>

                        <div className="flex gap-1 mt-0.5 flex-wrap min-h-[20px]">
                          {msg.reactions.map((reaction, i) => (
                            <button
                              key={i}
                              onClick={() => addReaction(msg.id, reaction.emoji)}
                              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-0.5 text-[10px] flex items-center gap-1 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            >
                              <span>{reaction.emoji}</span>
                              <span className="text-slate-500">{reaction.count}</span>
                            </button>
                          ))}

                          <div className={`${msg.reactions.length === 0 ? 'opacity-0 group-hover/message:opacity-100' : 'opacity-100'} transition-opacity`}>
                            <TooltipProvider>
                              <Tooltip delayDuration={0}>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 rounded-full p-0 text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-200 hover:bg-white"
                                  >
                                    <Smile className="h-3 w-3" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg rounded-full flex items-center gap-1">
                                  {REACTION_OPTIONS.map((option) => (
                                    <button
                                      key={option.label}
                                      className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-lg leading-none"
                                      onClick={() => addReaction(msg.id, option.emoji)}
                                      title={option.label}
                                    >
                                      {option.emoji}
                                    </button>
                                  ))}
                                  <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-0.5" />
                                  <button
                                    className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    title="Add Reaction"
                                  >
                                    <Plus className="h-4 w-4 text-slate-500" />
                                  </button>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2 shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition-all">
          <Input
            className="border-none shadow-none focus-visible:ring-0 px-3 min-h-[40px]"
            placeholder={`Message ${isChannel ? '#' + chatId : dmUser?.name}...`}
          />
          <div className="flex items-center justify-between px-2 pb-1 pt-2">
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <Smile className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600">
                <Paperclip className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" className="h-8 px-4">
              <Send className="h-3.5 w-3.5 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}