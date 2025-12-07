
import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  MoreHorizontal, 
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Plus,
  X,
  User,
  Tag,
  FolderInput,
  CheckCircle,
  Copy,
  Trash,
  Users,
  Zap
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";

// Mock data for contacts
const generateContacts = (count: number) => {
  const tags = ["Customer", "Lead", "VIP", "Partner", "Vendor", "New", "Inactive", "Referral", "Enterprise", "Small Business"];
  
  return Array.from({ length: count }).map((_, i) => {
    const hasImage = Math.random() > 0.6; // 40% chance of having an image
    const name = [
      "Alice Johnson", "Bob Smith", "Charlie Brown", "Diana Prince", 
      "Evan Wright", "Fiona Green", "George King", "Hannah White",
      "Ian Black", "Julia Roberts", "Kevin Lee", "Laura Croft",
      "Mike Tyson", "Nina Simone", "Oscar Wilde", "Paula Abdul",
      "Quincy Jones", "Rachel Green", "Steve Jobs", "Tina Turner"
    ][i % 20] + (Math.floor(i / 20) > 0 ? ` ${Math.floor(i / 20) + 1}` : "");
    
    // Generate initials
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

    // Random date within last 2 years
    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 730));

    // Random last active
    const lastActiveDate = new Date();
    lastActiveDate.setHours(lastActiveDate.getHours() - Math.floor(Math.random() * 100));

    // Random tags (1-5 tags)
    const numTags = Math.floor(Math.random() * 5) + 1;
    const contactTags = Array.from({ length: numTags }).map(() => tags[Math.floor(Math.random() * tags.length)]);
    const uniqueTags = Array.from(new Set(contactTags));

    // Random Date of Birth (20-60 years ago)
    const dob = new Date();
    dob.setFullYear(dob.getFullYear() - Math.floor(Math.random() * 40 + 20));
    dob.setMonth(Math.floor(Math.random() * 12));
    dob.setDate(Math.floor(Math.random() * 28 + 1));

    // Random Contact Source
    const sources = ["Website", "Referral", "LinkedIn", "Conference", "Cold Call", "Advertisement"];
    const source = sources[Math.floor(Math.random() * sources.length)];

    // Random Contact Type
    const types = ["Individual", "Company", "Non-Profit", "Government"];
    const type = types[Math.floor(Math.random() * types.length)];

    return {
      id: `contact-${i + 1}`,
      name,
      initials,
      email: `user${i + 1}@example.com`,
      phone: `+1 (555) 000-${(1000 + i).toString().slice(1)}`,
      image: hasImage ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}` : undefined,
      created: createdDate,
      lastActive: lastActiveDate,
      tags: uniqueTags,
      dob,
      source,
      type,
      dndEmail: Math.random() > 0.9,
      dndSms: Math.random() > 0.9,
      dndCall: Math.random() > 0.9,
      dndInboundCalls: Math.random() > 0.9,
      dndInboundSms: Math.random() > 0.9,
    };
  });
};

const allContacts = generateContacts(100);

export default function ContactsPage() {
  const [pageSize, setPageSize] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [, setLocation] = useLocation();
  
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    name: true,
    phone: true,
    email: true,
    created: true,
    lastActive: true,
    tags: true,
    dob: false,
    source: false,
    type: false,
    dndEmail: false,
    dndSms: false,
    dndCall: false,
    dndInboundCalls: false,
    dndInboundSms: false,
  });
  const [columnSearch, setColumnSearch] = useState("");

  const columns = [
    { id: "name", label: "Name" },
    { id: "phone", label: "Phone" },
    { id: "email", label: "Email" },
    { id: "created", label: "Created" },
    { id: "lastActive", label: "Last Activity" },
    { id: "tags", label: "Tags" },
    { id: "dob", label: "Date of Birth" },
    { id: "source", label: "Contact Source" },
    { id: "type", label: "Contact Type" },
    { id: "dndEmail", label: "DND Email" },
    { id: "dndSms", label: "DND SMS" },
    { id: "dndCall", label: "DND Calls" },
    { id: "dndInboundCalls", label: "DND Inbound Calls" },
    { id: "dndInboundSms", label: "DND Inbound SMS" },
  ];

  const filteredColumns = columns.filter(col => 
    col.label.toLowerCase().includes(columnSearch.toLowerCase())
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter contacts
  const filteredContacts = allContacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort contacts
  if (sortColumn) {
    filteredContacts.sort((a, b) => {
      let aValue: any = a[sortColumn as keyof typeof a];
      let bValue: any = b[sortColumn as keyof typeof b];

      // Handle dates specifically
      if (['created', 'lastActive', 'dob'].includes(sortColumn)) {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  // Pagination
  const totalPages = Math.ceil(filteredContacts.length / parseInt(pageSize));
  const startIndex = (currentPage - 1) * parseInt(pageSize);
  const endIndex = startIndex + parseInt(pageSize);
  const currentContacts = filteredContacts.slice(startIndex, endIndex);

  const toggleSelectAll = () => {
    if (selectedContacts.length === currentContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(currentContacts.map(c => c.id));
    }
  };

  const toggleSelectContact = (id: string) => {
    if (selectedContacts.includes(id)) {
      setSelectedContacts(selectedContacts.filter(c => c !== id));
    } else {
      setSelectedContacts([...selectedContacts, id]);
    }
  };

  const SortableHeader = ({ column, label, className = "" }: { column: string, label: string, className?: string }) => {
    return (
      <TableHead className={`cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none ${className}`} onClick={() => handleSort(column)}>
        <div className="flex items-center gap-1">
          {label}
          {sortColumn === column ? (
            sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-50" />
          )}
        </div>
      </TableHead>
    );
  };

  return (
    <DashboardLayout activeTool="users">
      <div className="space-y-4">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 p-4 rounded-lg border border-slate-200/60 dark:border-slate-800 backdrop-blur-sm">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-9 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 border-slate-200 dark:border-slate-800">
                  <Filter className="h-4 w-4 text-slate-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <div className="p-2">
                  <Input 
                    placeholder="Search columns..." 
                    className="h-8 text-xs" 
                    value={columnSearch}
                    onChange={(e) => setColumnSearch(e.target.value)}
                  />
                </div>
                <DropdownMenuSeparator />
                <div className="max-h-[200px] overflow-y-auto">
                  {filteredColumns.map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      checked={visibleColumns[col.id]}
                      onCheckedChange={(checked) => {
                        if (col.id === 'name') return;
                        setVisibleColumns(prev => ({ ...prev, [col.id]: checked }))
                      }}
                      onSelect={(e) => e.preventDefault()}
                      disabled={col.id === 'name'}
                      className="text-xs"
                    >
                      {col.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                  {filteredColumns.length === 0 && (
                    <div className="p-2 text-xs text-slate-500 text-center">
                      No columns found
                    </div>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2 h-8 px-2 text-xs font-normal text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Plus className="h-3.5 w-3.5" />
                    Add custom fields
                  </Button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" size="sm" className="gap-2 border-slate-200 dark:border-slate-800">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="rounded-lg border border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50">
                <TableHead className="w-[40px] pl-4">
                  <Checkbox 
                    checked={currentContacts.length > 0 && selectedContacts.length === currentContacts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                {visibleColumns.name && <SortableHeader column="name" label="Name" />}
                {visibleColumns.phone && <SortableHeader column="phone" label="Phone" />}
                {visibleColumns.email && <SortableHeader column="email" label="Email" />}
                {visibleColumns.created && <SortableHeader column="created" label="Created" />}
                {visibleColumns.lastActive && <SortableHeader column="lastActive" label="Last Activity" />}
                {visibleColumns.dob && <SortableHeader column="dob" label="Date of Birth" />}
                {visibleColumns.source && <SortableHeader column="source" label="Source" />}
                {visibleColumns.type && <SortableHeader column="type" label="Type" />}
                {visibleColumns.dndEmail && <SortableHeader column="dndEmail" label="DND Email" />}
                {visibleColumns.dndSms && <SortableHeader column="dndSms" label="DND SMS" />}
                {visibleColumns.dndCall && <SortableHeader column="dndCall" label="DND Calls" />}
                {visibleColumns.dndInboundCalls && <SortableHeader column="dndInboundCalls" label="DND Inbound Calls" />}
                {visibleColumns.dndInboundSms && <SortableHeader column="dndInboundSms" label="DND Inbound SMS" />}
                {visibleColumns.tags && <TableHead>Tags</TableHead>}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentContacts.length > 0 ? (
                currentContacts.map((contact) => (
                  <TableRow 
                    key={contact.id} 
                    className="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    onClick={(e) => {
                      // Prevent navigation if clicking checkbox or action button
                      if ((e.target as HTMLElement).closest('[role="checkbox"]') || (e.target as HTMLElement).closest('button')) {
                        return;
                      }
                      setLocation(`/contacts/${contact.id}`);
                    }}
                  >
                    <TableCell className="pl-4">
                      <Checkbox 
                        checked={selectedContacts.includes(contact.id)}
                        onCheckedChange={() => toggleSelectContact(contact.id)}
                      />
                    </TableCell>
                    {visibleColumns.name && (
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 bg-primary/10 text-primary">
                            {contact.image && <AvatarImage src={contact.image} />}
                            <AvatarFallback className="font-semibold text-xs">{contact.initials}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-slate-900 dark:text-slate-100">{contact.name}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.phone && (
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">{contact.phone}</span>
                      </TableCell>
                    )}
                    {visibleColumns.email && (
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">{contact.email}</span>
                      </TableCell>
                    )}
                    {visibleColumns.created && (
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>{format(contact.created, 'MMM d, yyyy')}</span>
                        </div>
                      </TableCell>
                    )}
                    {visibleColumns.lastActive && (
                      <TableCell>
                        <span className="text-sm text-slate-500 dark:text-slate-500">
                          {formatDistanceToNow(contact.lastActive, { addSuffix: true })}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dob && (
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {format(contact.dob, 'MMM d, yyyy')}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.source && (
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {contact.source}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.type && (
                      <TableCell>
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          {contact.type}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dndEmail && (
                      <TableCell>
                        <span className={`text-sm ${contact.dndEmail ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {contact.dndEmail ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dndSms && (
                      <TableCell>
                        <span className={`text-sm ${contact.dndSms ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {contact.dndSms ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dndCall && (
                      <TableCell>
                        <span className={`text-sm ${contact.dndCall ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {contact.dndCall ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dndInboundCalls && (
                      <TableCell>
                        <span className={`text-sm ${contact.dndInboundCalls ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {contact.dndInboundCalls ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.dndInboundSms && (
                      <TableCell>
                        <span className={`text-sm ${contact.dndInboundSms ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                          {contact.dndInboundSms ? 'Yes' : 'No'}
                        </span>
                      </TableCell>
                    )}
                    {visibleColumns.tags && (
                      <TableCell>
                        <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                          {contact.tags.slice(0, 2).map(tag => (
                            <Badge 
                              key={tag} 
                              variant="secondary" 
                              className="px-1.5 py-0 text-[10px] font-medium border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 whitespace-nowrap"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {contact.tags.length > 2 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Badge 
                                    variant="secondary" 
                                    className="px-1.5 py-0 text-[10px] font-medium border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-help"
                                  >
                                    +{contact.tags.length - 2}
                                  </Badge>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="flex flex-col gap-1">
                                    {contact.tags.slice(2).map(tag => (
                                      <span key={tag} className="text-xs">{tag}</span>
                                    ))}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    )}
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="h-24 text-center text-slate-500">
                    No contacts found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Rows per page</span>
              <Select value={pageSize} onValueChange={(val) => {
                setPageSize(val);
                setCurrentPage(1);
              }}>
                <SelectTrigger className="h-8 w-[70px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-8 w-8 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Selection Bar */}
        {selectedContacts.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-auto max-w-[90vw] animate-in slide-in-from-bottom-4 fade-in duration-200">
            <div className="bg-zinc-900 text-zinc-100 rounded-lg shadow-2xl p-1.5 flex items-center gap-1 border border-zinc-800 overflow-x-auto no-scrollbar">
              <div className="flex items-center gap-3 px-3 border-r border-zinc-700 mr-1 shrink-0">
                <span className="font-medium text-sm whitespace-nowrap">{selectedContacts.length} Selected</span>
                <button 
                  onClick={() => setSelectedContacts([])}
                  className="text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <CheckCircle className="h-4 w-4" />
                    Status
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-1" align="start">
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span>Lead</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span>Inactive</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span>Do Not Contact</span>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <User className="h-4 w-4" />
                    Assignees
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input placeholder="Search or enter email..." className="h-8 text-sm" />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                        <Users className="h-3 w-3" />
                      </div>
                      Unassign
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Jane Doe</div>
                      </div>
                      <div className="h-4 w-4 rounded border border-slate-300" />
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-blue-100 text-blue-600">SM</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Sarah Miller</div>
                      </div>
                      <div className="h-4 w-4 rounded border border-slate-300" />
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-emerald-100 text-emerald-600">TR</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-medium">Tanner Rima</div>
                      </div>
                      <div className="h-4 w-4 rounded border border-slate-300" />
                    </div>
                  </div>
                  <div className="p-2 border-t flex items-center gap-2">
                    <Switch id="notify-assign" className="scale-75" />
                    <label htmlFor="notify-assign" className="text-xs cursor-pointer">Send notifications</label>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <Tag className="h-4 w-4" />
                    Tags
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input placeholder="Search tags..." className="h-8 text-sm" />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-3.5 w-3.5 rounded-full bg-blue-500" />
                      <span>VIP</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-3.5 w-3.5 rounded-full bg-emerald-500" />
                      <span>Lead</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-3.5 w-3.5 rounded-full bg-amber-500" />
                      <span>Customer</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-3.5 w-3.5 rounded-full bg-purple-500" />
                      <span>Partner</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <div className="h-3.5 w-3.5 rounded-full bg-rose-500" />
                      <span>Inactive</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <Zap className="h-4 w-4" />
                    Automations
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <div className="p-2 border-b">
                    <Input placeholder="Search automations..." className="h-8 text-sm" />
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-1">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Active Workflows</div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      <span>New Lead Welcome</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Zap className="h-3.5 w-3.5 text-blue-500" />
                      <span>Inactive Re-engagement</span>
                    </div>
                    
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground mt-1">Triggers</div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Zap className="h-3.5 w-3.5 text-purple-500" />
                      <span>Birthday Offer</span>
                    </div>
                    <div className="flex items-center gap-2 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                      <Zap className="h-3.5 w-3.5 text-emerald-500" />
                      <span>Purchase Follow-up</span>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <div className="h-4 w-px bg-zinc-700 mx-1 shrink-0" />

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <FolderInput className="h-4 w-4" />
                    Move/Add
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Tabs defaultValue="move" className="w-full">
                    <TabsList className="w-full grid grid-cols-2 rounded-none border-b h-10 p-0 bg-transparent">
                      <TabsTrigger 
                        value="move" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2"
                      >
                        Move contacts
                      </TabsTrigger>
                      <TabsTrigger 
                        value="add" 
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2"
                      >
                        Add to
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="p-2">
                      <Input placeholder="Search Lists..." className="h-8 text-sm" />
                    </div>
                    
                    <div className="px-2 py-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Recents</div>
                      <div className="space-y-0.5">
                         <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                           <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                           <span>VIP Customers</span>
                         </div>
                         <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                           <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
                           <span>New Leads</span>
                         </div>
                      </div>
                    </div>
                    
                    <div className="px-2 py-1">
                      <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">Lists</div>
                      <div className="space-y-0.5">
                         <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                           <div className="h-3.5 w-3.5 rounded bg-blue-500" />
                           <span>Marketing</span>
                         </div>
                         <div className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer text-sm">
                           <div className="h-3.5 w-3.5 rounded bg-emerald-500" />
                           <span>Sales</span>
                         </div>
                      </div>
                    </div>

                    <div className="p-2 border-t flex items-center gap-2">
                      <Switch id="notify-move" className="scale-75" />
                      <label htmlFor="notify-move" className="text-xs cursor-pointer">Send notifications</label>
                    </div>
                  </Tabs>
                </PopoverContent>
              </Popover>

              <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                <Copy className="h-4 w-4" />
                Copy
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <Trash className="h-4 w-4 text-red-400" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Woah there, partner! 🤠</AlertDialogTitle>
                    <AlertDialogDescription>
                      You're about to send these contacts to the digital void. This action is as irreversible as a bad haircut before prom. Are you absolutely sure you want to do this?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Yes, delete them forever</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    More
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>
                    Archive
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem>
                    Merge Contacts
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}