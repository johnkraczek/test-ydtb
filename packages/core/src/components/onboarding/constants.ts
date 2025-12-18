import {
  Building2,
  Users,
  Briefcase,
  LayoutDashboard,
  Calendar,
  Inbox,
  MessageSquare,
  Image as ImageIcon,
  Zap,
  FileText,
  BookOpen,
  ClipboardCheck,
  Ticket,
  BarChart2,
  ListTodo,
  FileHeart,
  Globe,
  Rocket,
  Code,
  Coffee,
  Heart,
  Star,
  Smile,
  Pencil,
  Search,
  Settings,
  Shield,
  Smartphone,
  Sun,
  Truck,
  Wifi,
  Target,
} from "lucide-react";

import { Tool, IconOption, ColorOption, MockInvite } from "./types";

export const STEPS = [
  { id: 1, title: "Identity", icon: Building2 },
  { id: 2, title: "Description", icon: FileText },
  { id: 3, title: "Team", icon: Users },
  { id: 4, title: "Tools", icon: Zap },
  { id: 5, title: "Review", icon: ClipboardCheck },
];

export const AVAILABLE_TOOLS: Tool[] = [
  { id: "contacts", name: "Contacts", description: "Manage clients and leads", icon: Users },
  { id: "calendar", name: "Booking Calendar", description: "Schedule appointments", icon: Calendar },
  { id: "inbox", name: "Unified Inbox", description: "All messages in one place", icon: Inbox },
  { id: "dashboards", name: "Dashboards", description: "Visual data overview", icon: LayoutDashboard },
  { id: "team-chat", name: "Team Communication", description: "Internal team chat", icon: MessageSquare },
  { id: "media", name: "Media Library", description: "Manage files and assets", icon: ImageIcon },
  { id: "automations", name: "Automations", description: "Workflow automation", icon: Zap },
  { id: "website", name: "Website Pages", description: "Landing pages and funnels", icon: Globe },
  { id: "sop", name: "SOP Library", description: "Standard Operating Procedures", icon: BookOpen },
  { id: "check-in", name: "Check-In Tool", description: "Client check-in system", icon: ClipboardCheck },
  { id: "coupons", name: "Coupon Tool", description: "Manage discounts", icon: Ticket },
  { id: "analytics", name: "Analytics & Reporting", description: "Deep insights", icon: BarChart2 },
  { id: "todos", name: "Todos", description: "Task management", icon: ListTodo },
  { id: "massage-notes", name: "Massage Notes", description: "Coming soon", icon: FileHeart, disabled: true },
];

export const ICON_LIST: IconOption[] = [
  { name: "Building2", icon: Building2 },
  { name: "Briefcase", icon: Briefcase },
  { name: "Users", icon: Users },
  { name: "Globe", icon: Globe },
  { name: "Zap", icon: Zap },
  { name: "LayoutDashboard", icon: LayoutDashboard },
  { name: "Code", icon: Code },
  { name: "Coffee", icon: Coffee },
  { name: "Heart", icon: Heart },
  { name: "Star", icon: Star },
  { name: "Smile", icon: Smile },
  { name: "Rocket", icon: Rocket },
  { name: "Pencil", icon: Pencil },
  { name: "Search", icon: Search },
  { name: "Settings", icon: Settings },
  { name: "Shield", icon: Shield },
  { name: "Smartphone", icon: Smartphone },
  { name: "Sun", icon: Sun },
  { name: "Truck", icon: Truck },
  { name: "Wifi", icon: Wifi },
  { name: "Target", icon: Target },
];

export const COLORS: ColorOption[] = [
  { name: "Slate", value: "slate" },
  { name: "Red", value: "red" },
  { name: "Orange", value: "orange" },
  { name: "Amber", value: "amber" },
  { name: "Green", value: "green" },
  { name: "Teal", value: "teal" },
  { name: "Blue", value: "blue" },
  { name: "Indigo", value: "indigo" },
  { name: "Violet", value: "violet" },
  { name: "Pink", value: "pink" },
];

export const MOCK_INVITES: MockInvite[] = [
  {
    id: "inv_1",
    workspaceName: "Acme Corp",
    inviterName: "Sarah Connor",
    inviterEmail: "sarah@acme.com",
    role: "Member",
    sentAt: "2 days ago"
  },
  {
    id: "inv_2",
    workspaceName: "Design Studio X",
    inviterName: "John Wick",
    inviterEmail: "john@designx.com",
    role: "Admin",
    sentAt: "5 hours ago"
  }
];

export const ROLE_OPTIONS = [
  {
    id: "Admin",
    label: "Admin",
    description: "Can invite, configure, and manage workspace."
  },
  {
    id: "Member",
    label: "Member",
    description: "Can view and edit projects and tasks."
  },
  {
    id: "Guest",
    label: "Guest",
    description: "Limited access to specific items."
  }
];