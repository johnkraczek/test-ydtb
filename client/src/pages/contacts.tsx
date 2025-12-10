
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
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
  Zap,
  Archive,
  Merge
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { useLocation } from "wouter";
import {
  Type, 
  Hash, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  List, 
  Link as LinkIcon, 
  Calculator, 
  AlignLeft, 
  PlayCircle,
  DollarSign,
  ChevronDown,
  Globe,
  Sparkles,
  GripVertical,
  ArrowLeft,
  Settings
} from "lucide-react";
import { ViewSettings } from "@/components/dashboard/ViewSettings";
import {
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Label } from "@/components/ui/label";
import { FilterBuilder, Filter as FilterType } from "@/components/dashboard/FilterBuilder";

// Sortable Item Component
function SortableColumnItem({ id, column, visibleColumns, setVisibleColumns }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-3 py-2 group ${isDragging ? 'opacity-50' : ''}`}>
      <div {...attributes} {...listeners} className="cursor-move touch-none">
         <GripVertical className="h-4 w-4 text-slate-300 hover:text-slate-500 transition-colors" />
      </div>
      <div className="flex items-center gap-2 flex-1">
          {column.id === 'tags' ? <Tag className="h-4 w-4 text-slate-400" /> : 
           column.id === 'phone' ? <List className="h-4 w-4 text-slate-400" /> :
           column.id === 'dob' || column.id === 'created' ? <CalendarIcon className="h-4 w-4 text-slate-400" /> :
           <Type className="h-4 w-4 text-slate-400" />}
          <span className="text-sm text-slate-700 dark:text-slate-300">{column.label}</span>
      </div>
      <Switch 
          checked={true}
          onCheckedChange={(checked) => {
              if (column.id === 'name') return;
              setVisibleColumns((prev: any) => ({ ...prev, [column.id]: checked }))
          }}
          disabled={column.id === 'name'}
      />
    </div>
  );
}

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
  const [isViewSettingsOpen, setIsViewSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showAvatar, setShowAvatar] = useState(true);
  
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
    contactId: false,
  });
  const [columnSearch, setColumnSearch] = useState("");
  const [filters, setFilters] = useState<FilterType[]>([]);

  // Filter Logic
  const checkFilter = (contact: any, filter: FilterType) => {
    let value = contact[filter.field];
    
    // Handle special fields
    if (filter.field === 'tags') {
      value = contact.tags.join(' ');
    } else if (filter.field === 'created' || filter.field === 'dob' || filter.field === 'lastActive') {
      // For date comparisons, we might want to normalize or convert
      // For simplicity in this mockup, we'll convert dates to strings or timestamps if needed
      // But let's stick to string comparison/simple checks for now
      value = new Date(value).toISOString(); 
    } else if (typeof value === 'number') {
        value = value.toString();
    } else if (value === undefined || value === null) {
        value = '';
    } else {
        value = String(value).toLowerCase();
    }
    
    const filterValue = String(filter.value).toLowerCase();
    
    switch (filter.operator) {
      case 'contains':
        return value.includes(filterValue);
      case 'does_not_contain':
        return !value.includes(filterValue);
      case 'is':
        return value === filterValue;
      case 'is_not':
        return value !== filterValue;
      case 'starts_with':
        return value.startsWith(filterValue);
      case 'ends_with':
        return value.endsWith(filterValue);
      case 'is_empty':
        return !value || value.length === 0;
      case 'is_not_empty':
        return value && value.length > 0;
      default:
        return true;
    }
  };
  
  // Custom Column Creation State
  const [isColumnCreatorOpen, setIsColumnCreatorOpen] = useState(false);
  const [columnCreatorStep, setColumnCreatorStep] = useState<'field-manager' | 'type-selection' | 'configuration'>('type-selection');
  const [selectedColumnType, setSelectedColumnType] = useState<any>(null);
  const [isTypeSelectorOpen, setIsTypeSelectorOpen] = useState(false);
  const [createFieldSearch, setCreateFieldSearch] = useState("");
  const [existingFieldSearch, setExistingFieldSearch] = useState("");
  const [newColumnConfig, setNewColumnConfig] = useState({
    name: "",
    description: "",
    defaultValue: "",
    isRequired: false,
    isPinned: false,
    isVisibleToGuests: true
  });
  
  // Dropdown options state
  const [dropdownOptions, setDropdownOptions] = useState([
    { id: '1', label: 'Option 1', color: 'bg-pink-500' },
    { id: '2', label: 'Option 2', color: 'bg-purple-500' }
  ]);
  const [newOptionText, setNewOptionText] = useState("");

  const handleAddOption = () => {
    if (newOptionText.trim()) {
      const colors = ['bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 'bg-cyan-500', 'bg-blue-500', 'bg-indigo-500', 'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setDropdownOptions([
        ...dropdownOptions, 
        { 
          id: Math.random().toString(36).substr(2, 9), 
          label: newOptionText, 
          color: randomColor 
        }
      ]);
      setNewOptionText("");
    }
  };

  const handleRemoveOption = (id: string) => {
    setDropdownOptions(dropdownOptions.filter(opt => opt.id !== id));
  };

  const fieldTypes = [
    { icon: List, label: "Dropdown", type: "dropdown", color: "text-emerald-600" },
    { icon: Type, label: "Text", type: "text", color: "text-blue-600" },
    { icon: CalendarIcon, label: "Date", type: "date", color: "text-amber-600" },
    { icon: AlignLeft, label: "Text area (Long Text)", type: "textarea", color: "text-blue-600" },
    { icon: Hash, label: "Number", type: "number", color: "text-teal-600" },
    { icon: Tag, label: "Labels", type: "labels", color: "text-emerald-600" },
    { icon: CheckSquare, label: "Checkbox", type: "checkbox", color: "text-pink-600" },
    { icon: DollarSign, label: "Money", type: "money", color: "text-emerald-600" },
    { icon: Globe, label: "Website", type: "website", color: "text-red-600" },
    { icon: Calculator, label: "Formula", type: "formula", color: "text-emerald-600" },
    { icon: Sparkles, label: "Custom Text", type: "ai_text", color: "text-purple-600" },
    { icon: Sparkles, label: "Summary", type: "ai_summary", color: "text-purple-600" },
    { icon: Sparkles, label: "Progress Updates", type: "ai_progress", color: "text-purple-600" },
  ];

  const handleSelectType = (type: any) => {
    setSelectedColumnType(type);
    setColumnCreatorStep('configuration');
    setNewColumnConfig({ ...newColumnConfig, name: "" }); // Reset name
  };

  const handleCreateColumn = () => {
    if (!newColumnConfig.name) return;
    
    const newId = newColumnConfig.name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substr(2, 5);
    const newColumn = {
      id: newId,
      label: newColumnConfig.name,
      type: selectedColumnType?.type || 'text'
    };
    
    setColumns([...columns, newColumn]);
    setVisibleColumns(prev => ({
      ...prev,
      [newId]: true
    }));
    
    setIsColumnCreatorOpen(false);
    setColumnCreatorStep('type-selection');
    setSelectedColumnType(null);
    setNewColumnConfig({
      name: "",
      description: "",
      defaultValue: "",
      isRequired: false,
      isPinned: false,
      isVisibleToGuests: true
    });
  };

  const handleCloseCreator = () => {
    setIsColumnCreatorOpen(false);
    setTimeout(() => {
        setColumnCreatorStep('type-selection');
        setSelectedColumnType(null);
    }, 300);
  };

  const initialColumns = [
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
    { id: "contactId", label: "Contact Id" },
  ];

  const [columns, setColumns] = useState(initialColumns);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

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
  const filteredContacts = allContacts.filter(contact => {
    // Search query filter
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    if (!matchesSearch) return false;
    
    // Advanced filters
    if (filters.length === 0) return true;
    
    // Evaluate filters sequentially/recursively
    const evaluateFilters = (filterList: FilterType[], item: any): boolean => {
        if (filterList.length === 0) return true;
        
        let result = true;
        
        // Process first item
        const first = filterList[0];
        if (first.type === 'group') {
             // For a group, we recursively evaluate its items
             // If the group has no logic defined for its *internal* items relation to each other,
             // we assume the logic property of the *second* item in the group defines it?
             // Actually, my FilterGroup definition has `items` which is a list.
             // The list follows the same "item has logic property" pattern.
             // But the *group itself* is treated as a single boolean result in the parent list.
             result = evaluateFilters(first.items, item);
        } else {
             result = checkFilter(item, first);
        }
        
        // Process remaining items
        for (let i = 1; i < filterList.length; i++) {
            const filter = filterList[i];
            let matches = false;
            
            if (filter.type === 'group') {
                matches = evaluateFilters(filter.items, item);
            } else {
                matches = checkFilter(item, filter);
            }
            
            if (filter.logic === 'AND') {
                result = result && matches;
            } else {
                result = result || matches;
            }
        }
        
        return result;
    };
    
    return evaluateFilters(filters, contact);
  });

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

  const headerActions = (
    <div className="flex items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
        <Input 
          placeholder="Search contacts..." 
          className="pl-8 h-8 text-xs bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-offset-0"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />
      </div>

      <div className="flex items-center gap-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-sm">
        <FilterBuilder 
          columns={columns} 
          filters={filters} 
          onFiltersChange={setFilters}
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
        />
        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setIsViewSettingsOpen(true)}
        >
          <Settings className="h-4 w-4 text-slate-500" />
        </Button>
      </div>
      
      <Button variant="outline" size="sm" className="h-8 gap-2 bg-white text-xs border-slate-200 dark:border-slate-800">
        <Download className="h-3.5 w-3.5" />
        Export
      </Button>
      <ViewSettings 
        open={isViewSettingsOpen} 
        onOpenChange={setIsViewSettingsOpen} 
        onOpenFields={() => setIsColumnCreatorOpen(true)}
        onOpenFilter={() => setIsFilterOpen(true)}
        showAvatar={showAvatar}
        onShowAvatarChange={setShowAvatar}
      />
    </div>
  );

  return (
    <DashboardLayout 
      activeTool="users"
      header={
        <DashboardPageHeader
          title="Contacts"
          description="Manage your team and contacts."
          actions={headerActions}
          hideBreadcrumbs={true}
        />
      }
    >
      <div className="space-y-4">
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
                {columns.filter(col => visibleColumns[col.id]).map(col => {
                  if (col.id === 'name') return visibleColumns.name && (
                    <TableHead 
                      key={col.id} 
                      className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors select-none" 
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        Name
                        {sortColumn === 'name' ? (
                          sortDirection === 'asc' ? <ArrowUp className="h-3.5 w-3.5 text-primary" /> : <ArrowDown className="h-3.5 w-3.5 text-primary" />
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 text-slate-400 opacity-50" />
                        )}
                      </div>
                    </TableHead>
                  );
                  if (col.id === 'tags') return visibleColumns.tags && <TableHead key={col.id}>Tags</TableHead>;
                  return <SortableHeader key={col.id} column={col.id} label={col.label} />;
                })}
                <TableHead className="w-[50px] text-right pr-2">
                    <Sheet open={isColumnCreatorOpen} onOpenChange={setIsColumnCreatorOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[400px] sm:w-[450px] overflow-y-auto p-0">
                            {columnCreatorStep === 'field-manager' ? (
                                <div className="h-full flex flex-col">
                                    <div className="px-6 py-4 border-b">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => setColumnCreatorStep('type-selection')}>
                                                    <ArrowLeft className="h-4 w-4" />
                                                </Button>
                                                <h2 className="text-lg font-semibold">Fields</h2>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                placeholder="Search for new or existing fields" 
                                                className="pl-9 bg-slate-50 dark:bg-slate-900" 
                                                value={existingFieldSearch}
                                                onChange={(e) => setExistingFieldSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto">
                                        {/* Shown Columns */}
                                        <div className="px-6 py-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-xs font-medium text-slate-500">Shown</h3>
                                                <Button 
                                                    variant="ghost" 
                                                    className="h-auto p-0 text-xs text-slate-500 font-normal hover:bg-transparent hover:text-slate-900"
                                                    onClick={() => {
                                                        setVisibleColumns(prev => {
                                                            const next = { ...prev };
                                                            Object.keys(next).forEach(key => {
                                                                if (key !== 'name') {
                                                                    next[key] = false;
                                                                }
                                                            });
                                                            return next;
                                                        });
                                                    }}
                                                >
                                                    Hide all
                                                </Button>
                                            </div>
                                            <div className="space-y-1">
                                                <DndContext 
                                                    sensors={sensors}
                                                    collisionDetection={closestCenter}
                                                    onDragEnd={handleDragEnd}
                                                >
                                                    <SortableContext 
                                                        items={columns.filter(col => visibleColumns[col.id] && col.label.toLowerCase().includes(existingFieldSearch.toLowerCase())).map(col => col.id)}
                                                        strategy={verticalListSortingStrategy}
                                                    >
                                                        {columns.filter(col => visibleColumns[col.id] && col.label.toLowerCase().includes(existingFieldSearch.toLowerCase())).map(col => (
                                                            <SortableColumnItem 
                                                                key={col.id}
                                                                id={col.id}
                                                                column={col}
                                                                visibleColumns={visibleColumns}
                                                                setVisibleColumns={setVisibleColumns}
                                                            />
                                                        ))}
                                                    </SortableContext>
                                                </DndContext>
                                            </div>
                                        </div>

                                        <Separator />

                                        {/* Hidden Columns */}
                                        <div className="px-6 py-4">
                                            <h3 className="text-xs font-medium text-slate-500 mb-2">Hidden</h3>
                                            <div className="space-y-1">
                                                {columns.filter(col => !visibleColumns[col.id] && col.label.toLowerCase().includes(existingFieldSearch.toLowerCase())).map(col => (
                                                    <div key={col.id} className="flex items-center gap-3 py-2 pl-7 group">
                                                        <div className="flex items-center gap-2 flex-1">
                                                            {col.id === 'tags' ? <Tag className="h-4 w-4 text-slate-400" /> : 
                                                             col.id === 'phone' ? <List className="h-4 w-4 text-slate-400" /> :
                                                             col.id === 'dob' || col.id === 'created' ? <CalendarIcon className="h-4 w-4 text-slate-400" /> :
                                                             <Type className="h-4 w-4 text-slate-400" />}
                                                            <span className="text-sm text-slate-700 dark:text-slate-300">{col.label}</span>
                                                        </div>
                                                        <Switch 
                                                            checked={false}
                                                            onCheckedChange={(checked) => {
                                                                setVisibleColumns(prev => ({ ...prev, [col.id]: checked }))
                                                            }}
                                                        />
                                                    </div>
                                                ))}
                                                {columns.filter(col => !visibleColumns[col.id] && col.label.toLowerCase().includes(existingFieldSearch.toLowerCase())).length === 0 && (
                                                    <div className="text-xs text-slate-400 italic py-2 pl-7">No hidden fields found</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 border-t mt-auto">
                                        <Button 
                                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                                            onClick={() => setColumnCreatorStep('type-selection')}
                                        >
                                            Create new field
                                        </Button>
                                    </div>
                                </div>
                            ) : columnCreatorStep === 'type-selection' ? (
                                <div className="h-full flex flex-col">
                                    <div className="px-6 py-4 border-b">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-semibold">Create field</h2>
                                            </div>
                                        </div>
                                        <div className="relative">
                                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                            <Input 
                                                placeholder="Search for new or existing fields" 
                                                className="pl-9 bg-slate-50 dark:bg-slate-900" 
                                                value={createFieldSearch}
                                                onChange={(e) => setCreateFieldSearch(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto py-2">
                                        <div className="px-6 pb-2 pt-2">
                                            <h3 className="text-xs font-medium text-slate-500 mb-2">Suggested</h3>
                                            <div className="space-y-1">
                                                {[
                                                    { icon: List, label: "CRM Lead Qualification Status", color: "text-emerald-600" },
                                                    { icon: DollarSign, label: "Opportunity Value (USD)", color: "text-emerald-600" },
                                                    { icon: Type, label: "Client Contact Preference", color: "text-blue-600" },
                                                    { icon: Sparkles, label: "Next Best Action", color: "text-purple-600" }
                                                ].filter(item => item.label.toLowerCase().includes(createFieldSearch.toLowerCase())).map((item, i) => (
                                                    <Button key={i} variant="ghost" className="w-full justify-start gap-3 h-9 font-normal text-slate-700 dark:text-slate-300">
                                                        <item.icon className={`h-4 w-4 ${item.color}`} /> {item.label}
                                                    </Button>
                                                ))}
                                                {[
                                                    { icon: List, label: "CRM Lead Qualification Status", color: "text-emerald-600" },
                                                    { icon: DollarSign, label: "Opportunity Value (USD)", color: "text-emerald-600" },
                                                    { icon: Type, label: "Client Contact Preference", color: "text-blue-600" },
                                                    { icon: Sparkles, label: "Next Best Action", color: "text-purple-600" }
                                                ].filter(item => item.label.toLowerCase().includes(createFieldSearch.toLowerCase())).length === 0 && (
                                                    <div className="text-xs text-slate-400 italic px-2">No suggestions found</div>
                                                )}
                                            </div>
                                        </div>

                                        <Separator className="my-2" />

                                        <div className="px-6 pb-2">
                                            <h3 className="text-xs font-medium text-slate-500 mb-2">AI fields</h3>
                                            <div className="space-y-1">
                                                {fieldTypes.filter(f => f.type.startsWith('ai_') && f.label.toLowerCase().includes(createFieldSearch.toLowerCase())).map((field) => (
                                                    <Button 
                                                        key={field.type} 
                                                        variant="ghost" 
                                                        className="w-full justify-start gap-3 h-9 font-normal text-slate-700 dark:text-slate-300"
                                                        onClick={() => handleSelectType(field)}
                                                    >
                                                        <field.icon className={`h-4 w-4 ${field.color}`} /> {field.label}
                                                    </Button>
                                                ))}
                                                {fieldTypes.filter(f => f.type.startsWith('ai_') && f.label.toLowerCase().includes(createFieldSearch.toLowerCase())).length === 0 && (
                                                    <div className="text-xs text-slate-400 italic px-2">No AI fields found</div>
                                                )}
                                            </div>
                                        </div>

                                        <Separator className="my-2" />

                                        <div className="px-6 pb-6">
                                            <h3 className="text-xs font-medium text-slate-500 mb-2">All</h3>
                                            <div className="space-y-1">
                                                {fieldTypes.filter(f => !f.type.startsWith('ai_') && f.label.toLowerCase().includes(createFieldSearch.toLowerCase())).map((field) => (
                                                    <Button 
                                                        key={field.type} 
                                                        variant="ghost" 
                                                        className="w-full justify-start gap-3 h-9 font-normal text-slate-700 dark:text-slate-300"
                                                        onClick={() => handleSelectType(field)}
                                                    >
                                                        <field.icon className={`h-4 w-4 ${field.color}`} /> {field.label}
                                                    </Button>
                                                ))}
                                                {fieldTypes.filter(f => !f.type.startsWith('ai_') && f.label.toLowerCase().includes(createFieldSearch.toLowerCase())).length === 0 && (
                                                    <div className="text-xs text-slate-400 italic px-2">No fields found</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4 border-t mt-auto">
                                        <Button variant="outline" className="w-full gap-2 text-primary border-primary/20 bg-primary/5 hover:bg-primary/10" onClick={() => setColumnCreatorStep('field-manager')}>
                                            <Plus className="h-4 w-4" /> Add existing fields
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col">
                                    <div className="px-6 py-4 border-b">
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="-ml-2 h-8 w-8" onClick={() => setColumnCreatorStep('type-selection')}>
                                                <ArrowLeft className="h-4 w-4" />
                                            </Button>
                                            
                                            <Popover open={isTypeSelectorOpen} onOpenChange={setIsTypeSelectorOpen}>
                                                <PopoverTrigger asChild>
                                                    <Button variant="ghost" className="flex items-center gap-2 h-9 px-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md">
                                                        {selectedColumnType && <selectedColumnType.icon className={`h-4 w-4 ${selectedColumnType.color}`} />}
                                                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedColumnType?.label}</h2>
                                                        <ChevronDown className="h-4 w-4 text-slate-400" />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="p-0 w-[280px]" align="start">
                                                    <Command>
                                                        <CommandInput placeholder="Search..." />
                                                        <CommandList>
                                                            <CommandEmpty>No results found.</CommandEmpty>
                                                            <CommandGroup>
                                                                {fieldTypes.map((type) => (
                                                                    <CommandItem
                                                                        key={type.type}
                                                                        value={type.label}
                                                                        onSelect={() => {
                                                                            setSelectedColumnType(type);
                                                                            setIsTypeSelectorOpen(false);
                                                                        }}
                                                                        className="flex items-center gap-3 py-2.5 cursor-pointer"
                                                                    >
                                                                        <type.icon className={`h-4 w-4 ${type.color}`} />
                                                                        <span>{type.label}</span>
                                                                    </CommandItem>
                                                                ))}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="field-name">Field name <span className="text-red-500">*</span></Label>
                                            <Input 
                                                id="field-name" 
                                                placeholder="Enter name..." 
                                                value={newColumnConfig.name}
                                                onChange={(e) => setNewColumnConfig({...newColumnConfig, name: e.target.value})}
                                            />
                                        </div>

                                        {(selectedColumnType?.type === 'dropdown' || selectedColumnType?.type === 'labels') && (
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-normal text-slate-500">
                                                        {selectedColumnType.type === 'dropdown' ? 'Dropdown options' : 'Labels options'} <span className="text-red-500">*</span>
                                                    </Label>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <ArrowUpDown className="h-3 w-3" />
                                                        <span>Manual</span>
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-2">
                                                    {dropdownOptions.map((option) => (
                                                        <div key={option.id} className="flex items-center gap-2 group">
                                                            <div className="flex-1 flex items-center gap-2 h-9 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                                                                <div className={`h-2 w-2 rounded-full ${option.color}`} />
                                                                <span className="text-sm text-slate-700 dark:text-slate-300">{option.label}</span>
                                                            </div>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon" 
                                                                className="h-8 w-8 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                                onClick={() => handleRemoveOption(option.id)}
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    ))}

                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 flex items-center gap-2 px-3 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                                                            <Plus className="h-4 w-4 text-indigo-600 bg-indigo-50 rounded-full p-0.5" />
                                                            <Input 
                                                                className="border-0 p-0 h-9 focus-visible:ring-0 placeholder:text-slate-400"
                                                                placeholder="Type or paste options"
                                                                value={newOptionText}
                                                                onChange={(e) => setNewOptionText(e.target.value)}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter') {
                                                                        e.preventDefault();
                                                                        handleAddOption();
                                                                    }
                                                                }}
                                                            />
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm">
                                                                <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label>Fill method</Label>
                                            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                                                <Button variant="ghost" size="sm" className="flex-1 bg-white dark:bg-slate-700 shadow-sm rounded-md h-8 text-xs font-medium">
                                                    Manual fill
                                                </Button>
                                                <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs font-medium text-slate-500 gap-1.5">
                                                    <Sparkles className="h-3 w-3 text-purple-500" /> Fill with AI
                                                </Button>
                                            </div>
                                        </div>

                                        <Collapsible>
                                            <CollapsibleTrigger className="flex items-center justify-between w-full text-sm font-medium text-slate-900 dark:text-slate-100 mb-2 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded px-1 transition-colors group">
                                                More settings and permissions
                                                <ChevronDown className="h-4 w-4 text-slate-400 group-data-[state=open]:rotate-180 transition-transform" />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent className="space-y-6 pt-2 pb-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="description" className="text-xs font-normal text-slate-500">Description</Label>
                                                    <Input 
                                                        id="description" 
                                                        placeholder="Tell other users how to use this field" 
                                                        value={newColumnConfig.description}
                                                        onChange={(e) => setNewColumnConfig({...newColumnConfig, description: e.target.value})}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="default-value" className="text-xs font-normal text-slate-500">Default value</Label>
                                                    <Input 
                                                        id="default-value" 
                                                        placeholder="Text" 
                                                        value={newColumnConfig.defaultValue}
                                                        onChange={(e) => setNewColumnConfig({...newColumnConfig, defaultValue: e.target.value})}
                                                    />
                                                </div>

                                                <div className="space-y-2">
                                                    <Label className="text-xs font-normal text-slate-500">Baseline permissions</Label>
                                                    <div className="flex gap-2">
                                                        <Button variant="outline" className="flex-1 justify-between font-normal text-slate-600">
                                                            <span className="flex items-center gap-2"><User className="h-3.5 w-3.5" /> Default</span>
                                                            <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                                                        </Button>
                                                        <Button variant="outline" className="flex-none font-normal text-slate-600">
                                                            Make private
                                                        </Button>
                                                    </div>
                                                </div>
                                                
                                                <div className="pt-2 flex items-center gap-2">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src="https://github.com/shadcn.png" />
                                                        <AvatarFallback>JD</AvatarFallback>
                                                    </Avatar>
                                                    <div className="text-xs">
                                                        <span className="font-medium text-slate-900 dark:text-slate-100">John Doe</span>
                                                        <Badge variant="secondary" className="ml-2 text-[10px] h-4 px-1 bg-indigo-50 text-indigo-600 border-indigo-100">creator</Badge>
                                                    </div>
                                                    <span className="text-xs text-slate-400 ml-auto">Can edit</span>
                                                </div>

                                                <Separator />

                                                <div className="space-y-4">
                                                    <Label className="text-sm font-medium">Display settings</Label>
                                                    
                                                    <div className="flex items-start gap-3">
                                                        <Switch 
                                                            id="required" 
                                                            checked={newColumnConfig.isRequired} 
                                                            onCheckedChange={(c) => setNewColumnConfig({...newColumnConfig, isRequired: c})}
                                                        />
                                                        <div className="space-y-1">
                                                            <Label htmlFor="required" className="text-sm font-medium leading-none">Required in tasks</Label>
                                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                                Required Custom Fields must be filled out when creating tasks in all the locations where the Custom Field is used in your Workspace.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <Switch 
                                                            id="pinned" 
                                                            checked={newColumnConfig.isPinned} 
                                                            onCheckedChange={(c) => setNewColumnConfig({...newColumnConfig, isPinned: c})}
                                                        />
                                                        <div className="space-y-1">
                                                            <Label htmlFor="pinned" className="text-sm font-medium leading-none">Pinned</Label>
                                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                                Pinned Custom Fields will always be displayed in Task view, even if empty.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-start gap-3">
                                                        <Switch 
                                                            id="guests" 
                                                            checked={newColumnConfig.isVisibleToGuests} 
                                                            onCheckedChange={(c) => setNewColumnConfig({...newColumnConfig, isVisibleToGuests: c})}
                                                        />
                                                        <div className="space-y-1">
                                                            <Label htmlFor="guests" className="text-sm font-medium leading-none">Visible to guests and limited members</Label>
                                                            <p className="text-xs text-slate-500 leading-relaxed">
                                                                Custom Fields can be hidden or shown to guests and limited members in your Workspace.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    </div>
                                    <div className="p-4 flex justify-end gap-2 bg-white dark:bg-slate-900 mt-auto">
                                        <Button variant="outline" onClick={handleCloseCreator}>Cancel</Button>
                                        <Button 
                                            onClick={handleCreateColumn}
                                            disabled={!newColumnConfig.name}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                                        >
                                            Create
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </SheetContent>
                    </Sheet>
                </TableHead>
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
                    {columns.filter(col => visibleColumns[col.id]).map(col => {
                      if (col.id === 'name') {
                        return (
                          <TableCell key={col.id}>
                            <div className="flex items-center gap-3">
                              {showAvatar && (
                                <Avatar className="h-9 w-9 border border-slate-200 dark:border-slate-700 bg-primary/10 text-primary">
                                  {contact.image && <AvatarImage src={contact.image} />}
                                  <AvatarFallback className="font-semibold text-xs">{contact.initials}</AvatarFallback>
                                </Avatar>
                              )}
                              <span className="font-medium text-slate-900 dark:text-slate-100">{contact.name}</span>
                            </div>
                          </TableCell>
                        );
                      }
                      if (col.id === 'phone') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">{contact.phone}</span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'email') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400">{contact.email}</span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'created') {
                        return (
                          <TableCell key={col.id}>
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                              <Calendar className="h-3.5 w-3.5 text-slate-400" />
                              <span>{format(contact.created, 'MMM d, yyyy')}</span>
                            </div>
                          </TableCell>
                        );
                      }
                      if (col.id === 'lastActive') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-500 dark:text-slate-500">
                              {formatDistanceToNow(contact.lastActive, { addSuffix: true })}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dob') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {format(contact.dob, 'MMM d, yyyy')}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'source') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {contact.source}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'type') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400">
                              {contact.type}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dndEmail') {
                        return (
                          <TableCell key={col.id}>
                            <span className={`text-sm ${contact.dndEmail ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {contact.dndEmail ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dndSms') {
                        return (
                          <TableCell key={col.id}>
                            <span className={`text-sm ${contact.dndSms ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {contact.dndSms ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dndCall') {
                        return (
                          <TableCell key={col.id}>
                            <span className={`text-sm ${contact.dndCall ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {contact.dndCall ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dndInboundCalls') {
                        return (
                          <TableCell key={col.id}>
                            <span className={`text-sm ${contact.dndInboundCalls ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {contact.dndInboundCalls ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'dndInboundSms') {
                        return (
                          <TableCell key={col.id}>
                            <span className={`text-sm ${contact.dndInboundSms ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                              {contact.dndInboundSms ? 'Yes' : 'No'}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'contactId') {
                        return (
                          <TableCell key={col.id}>
                            <span className="text-sm text-slate-600 dark:text-slate-400 font-mono text-xs">
                              {contact.id}
                            </span>
                          </TableCell>
                        );
                      }
                      if (col.id === 'tags') {
                        return (
                          <TableCell key={col.id}>
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
                        );
                      }
                      return <TableCell key={col.id} />;
                    })}
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
                <Users className="h-4 w-4" />
                Create Group
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
                  <DropdownMenuCheckboxItem className="gap-2">
                    <Archive className="h-4 w-4" />
                    Archive
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem className="gap-2">
                    <Merge className="h-4 w-4" />
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