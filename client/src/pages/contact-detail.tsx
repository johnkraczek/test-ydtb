import { useState } from "react";
import { useRoute, Link } from "wouter";
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  Ticket, 
  DollarSign, 
  Tag,
  Send,
  MessageSquare,
  User,
  Store,
  Plus,
  CreditCard,
  Gift,
  PenLine,
  StickyNote,
  X,
  Check,
  LayoutGrid,
  GripVertical,
  Settings,
  Columns,
  Search,
  Pencil
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
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

import { ContactEditDrawer, MOCK_FOLDERS, MOCK_FIELDS } from "@/components/dashboard/ContactEditDrawer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Sortable Card Item Component
function SortableCardItem({ id, label, visible, onVisibilityChange }: any) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    position: 'relative' as 'relative',
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("flex items-center gap-3 py-2 group px-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800/50", isDragging ? 'opacity-50 bg-slate-100 dark:bg-slate-800' : '')}>
      <div {...attributes} {...listeners} className="cursor-move touch-none text-slate-400 hover:text-slate-600 outline-none">
         <GripVertical className="h-4 w-4" />
      </div>
      <span className="text-sm font-medium flex-1 truncate">{label}</span>
      <Switch 
          checked={visible}
          onCheckedChange={onVisibilityChange}
      />
    </div>
  );
}

export default function ContactDetailPage() {
  const [, params] = useRoute("/contacts/:id");
  const id = params?.id;
  const { toast } = useToast();

  // Layout Configuration State
  const [layoutConfigOpen, setLayoutConfigOpen] = useState(false);
  const [columnCount, setColumnCount] = useState(3);
  const [fieldSearch, setFieldSearch] = useState("");

  const allCards = [
    ...MOCK_FOLDERS.map(f => ({ id: `folder-${f.id}`, label: f.name })),
    { id: 'card-additional', label: 'Additional Info' },
    { id: 'card-system', label: 'System Details' },
    { id: 'card-tags', label: 'Tags' },
    { id: 'card-offers', label: 'Active Offers' }
  ];

  const [visibleCards, setVisibleCards] = useState<Record<string, boolean>>({
    ...Object.fromEntries(allCards.map(c => [c.id, true]))
  });

  const [cardOrder, setCardOrder] = useState<string[]>(allCards.map(c => c.id));

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleCardVisibility = (id: string, visible: boolean) => {
    setVisibleCards(prev => ({ ...prev, [id]: visible }));
  };

  // Mock Data based on ID (In a real app, fetch this)
  const [customer, setCustomer] = useState({
    id: id || "1",
    firstName: "Sarah",
    lastName: "Miller",
    email: "sarah.m@example.com",
    phone: "(555) 123-4567",
    location: "New York, NY",
    joinDate: "Oct 12, 2024",
    dob: "1990-05-15",
    source: "Walk-in",
    status: "VIP",
    totalSpend: 450.00,
    visits: 12,
    avgTicket: 37.50,
    lastVisit: "2 days ago",
    points: 850,
    tier: "Gold",
    tags: ["Local", "Wine Lover", "Lunch Crowd"],
    dnd: {
      email: false,
      sms: false
    },
    customData: {
      "Dietary Restrictions": "Gluten Free",
      "Anniversary": "06/20",
      "Kids Names": "Leo, Mia"
    },
    // Mock values for Custom Fields
    job_title: "Marketing Director",
    company_size: "50+",
    annual_revenue: 1200000,
    lead_source_detail: "LinkedIn Campaign",
    interests: ["Product A", "Consulting"],
    contract_start_date: "2024-01-15",
    uncategorized_field: "Some value"
  });

  // Active Offers State
  const [activeOffers, setActiveOffers] = useState([
    {
      id: 1,
      title: "Free Dessert",
      description: "Expires in 5 days",
      status: "active"
    },
    {
      id: 2,
      title: "10% Off Lunch",
      description: "Redeemed",
      status: "redeemed"
    }
  ]);

  const availableOffers = [
    { id: 101, title: "Free Appetizer", description: "Valid for 7 days" },
    { id: 102, title: "BOGO Entree", description: "Valid on Tuesdays" },
    { id: 103, title: "50% Off Drinks", description: "Happy Hour only" },
    { id: 104, title: "$10 Voucher", description: "Loyalty Reward" },
  ];

  const handleAddOffer = (offer: { id: number, title: string, description: string }) => {
    const newOffer = {
      id: Date.now(),
      title: offer.title,
      description: offer.description,
      status: "active"
    };
    setActiveOffers([newOffer, ...activeOffers]);
    toast({
      title: "Offer Added",
      description: `${offer.title} has been added to customer's active offers.`,
    });
  };

  // Tags Management
  const [allTags, setAllTags] = useState([
    "Local", "Wine Lover", "Lunch Crowd", "Vegan", "Gluten Free", "Big Spender", "Regular", "Family", "Student", "VIP"
  ]);
  const [tagSearch, setTagSearch] = useState("");
  const [tagPopoverOpen, setTagPopoverOpen] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!customer.tags.includes(tag)) {
      setCustomer({...customer, tags: [...customer.tags, tag]});
      toast({
        title: "Tag Added",
        description: `Tag "${tag}" added to customer profile.`,
      });
    }
    setTagPopoverOpen(false);
    setTagSearch("");
  };

  const handleRemoveTag = (tag: string) => {
    setCustomer({...customer, tags: customer.tags.filter(t => t !== tag)});
    toast({
      title: "Tag Removed",
      description: `Tag "${tag}" removed from profile.`,
    });
  };

  // Filter state for metrics
  const [metricsFilter, setMetricsFilter] = useState("last_quarter");

  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);

  const handleSaveProfile = (updatedContact: any) => {
    setCustomer(updatedContact);
    toast({
      title: "Profile Updated",
      description: "Customer details have been saved successfully.",
    });
  };


  const [activities, setActivities] = useState([
    {
      id: 1,
      type: "redemption",
      source: "customer",
      title: "Redeemed Coupon",
      date: "2 days ago",
      description: "Used \"Free Appetizer\" coupon with main course order.",
      meta: "Ticket Value: $45.20"
    },
    {
      id: 2,
      type: "loyalty",
      source: "customer",
      title: "Loyalty Check-in",
      date: "1 week ago",
      description: "Earned 45 points.",
      meta: null
    },
    {
      id: 3,
      type: "email",
      source: "restaurant",
      title: "Opened Campaign Email",
      date: "2 weeks ago",
      description: "\"Weekend Special: 2-for-1 Burgers\"",
      meta: null
    },
    {
      id: 4,
      type: "activation",
      source: "customer",
      title: "Loyalty Card Activated",
      date: "Oct 12, 2024",
      description: "Customer activated digital loyalty card.",
      meta: null
    },
    {
      id: 5,
      type: "sms",
      source: "restaurant",
      title: "Sent SMS Campaign",
      date: "3 weeks ago",
      description: "Hey Sarah! Come in this week for double points on all entrees.",
      meta: null
    },
    {
      id: 6,
      type: "offer",
      source: "restaurant",
      title: "Sent Special Offer",
      date: "1 month ago",
      description: "Sent \"Free Dessert\" offer for birthday.",
      meta: "Expires in 30 days"
    },
    {
      id: 7,
      type: "tag",
      source: "restaurant",
      title: "Added Tag",
      date: "1 month ago",
      description: "Added tag \"Wine Lover\" based on purchase history.",
      meta: null
    },
    {
      id: 8,
      type: "update",
      source: "restaurant",
      title: "Updated Profile",
      date: "2 months ago",
      description: "Updated dietary restrictions: Gluten Free.",
      meta: null
    },
    {
      id: 9,
      type: "review",
      source: "customer",
      title: "Left 5-Star Review",
      date: "2 months ago",
      description: "\"Amazing service and the gluten free pasta was incredible!\"",
      meta: "Rating: 5/5"
    },
    {
      id: 10,
      type: "note",
      source: "restaurant",
      title: "Added Note",
      date: "3 months ago",
      description: "Customer prefers booth seating near the window.",
      meta: null
    }
  ]);

  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageType, setMessageType] = useState("email");

  const handleSendMessage = () => {
    const newActivity = {
      id: Date.now(),
      type: messageType,
      source: "restaurant",
      title: messageType === "email" ? "Sent Email" : "Sent SMS",
      date: "Just now",
      description: messageType === "email" ? `Subject: ${messageSubject}` : messageBody,
      meta: null
    };

    setActivities([newActivity, ...activities]);
    setMessageSubject("");
    setMessageBody("");
    
    toast({
      title: "Message Sent",
      description: `${messageType === "email" ? "Email" : "SMS"} sent successfully to ${customer.firstName} ${customer.lastName}`,
    });
  };

  // Mock logic to change numbers based on filter
  const getFilteredMetrics = () => {
    switch(metricsFilter) {
      case "last_week":
        return { spend: 45.00, visits: 1, avg: 45.00 };
      case "last_month":
        return { spend: 125.50, visits: 3, avg: 41.83 };
      case "last_quarter":
        return { spend: 450.00, visits: 12, avg: 37.50 };
      case "last_year":
        return { spend: 1850.00, visits: 45, avg: 41.11 };
      case "all_time":
        return { spend: 2450.00, visits: 62, avg: 39.51 };
      default:
        return { spend: 450.00, visits: 12, avg: 37.50 };
    }
  };

  const metrics = getFilteredMetrics();

  return (
    <DashboardLayout 
      activeTool="users"
      header={
        <DashboardPageHeader
          hideBreadcrumbs={true}
          title={
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link href="/contacts">
                            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">
                              <ArrowLeft className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                            </Button>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Back to Contacts</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Avatar className="h-14 w-14 border-2 border-card shadow-sm">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {customer.firstName[0]}{customer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                        {customer.firstName} {customer.lastName}
                        <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {customer.status}
                        </Badge>
                      </h1>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1">
                        <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {customer.email}</span>
                        <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {customer.phone}</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {customer.location}</span>
                      </div>
                    </div>
                </div>
            </div>
          }
          actions={
            <div className="flex items-center gap-2 pt-8">
              <Sheet open={layoutConfigOpen} onOpenChange={setLayoutConfigOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-10 w-10 border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                    <Settings className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[360px] sm:w-[360px] p-0 flex flex-col h-full">
                  <SheetHeader className="px-4 py-3 border-b flex-none">
                    <SheetTitle className="text-base font-medium">Customize view</SheetTitle>
                  </SheetHeader>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Column Count */}
                    <div className="space-y-3">
                       <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Layout</Label>
                       <div className="grid grid-cols-3 gap-2">
                          {[1, 2, 3].map(count => (
                            <Button 
                              key={count}
                              variant={columnCount === count ? "default" : "outline"}
                              className="flex flex-col items-center justify-center h-16 gap-1"
                              onClick={() => setColumnCount(count)}
                            >
                              <Columns className="h-4 w-4" />
                              <span className="text-xs">{count} Col</span>
                            </Button>
                          ))}
                       </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Card Management */}
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                         <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cards</Label>
                         <Button 
                           variant="ghost" 
                           className="h-auto p-0 text-xs text-muted-foreground font-normal hover:bg-transparent hover:text-foreground"
                           onClick={() => {
                               setVisibleCards(prev => {
                                   const next = { ...prev };
                                   Object.keys(next).forEach(key => next[key] = false);
                                   return next;
                               });
                           }}
                         >
                           Hide all
                         </Button>
                       </div>
                       
                       {/* Search */}
                       <div className="relative">
                          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input 
                              placeholder="Search cards..." 
                              className="pl-9 h-9" 
                              value={fieldSearch}
                              onChange={(e) => setFieldSearch(e.target.value)}
                          />
                       </div>

                       {/* Shown Cards (Sortable) */}
                       <div className="space-y-1">
                          <div className="text-xs font-medium text-muted-foreground mb-2">Shown</div>
                          <DndContext 
                              sensors={sensors}
                              collisionDetection={closestCenter}
                              onDragEnd={handleDragEnd}
                          >
                              <SortableContext 
                                  items={cardOrder.filter(id => visibleCards[id])}
                                  strategy={verticalListSortingStrategy}
                              >
                                  {cardOrder.filter(id => {
                                      const card = allCards.find(c => c.id === id);
                                      return visibleCards[id] && card?.label.toLowerCase().includes(fieldSearch.toLowerCase());
                                  }).map(id => {
                                      const card = allCards.find(c => c.id === id);
                                      return (
                                          <SortableCardItem 
                                              key={id}
                                              id={id}
                                              label={card?.label}
                                              visible={true}
                                              onVisibilityChange={(checked: boolean) => toggleCardVisibility(id, checked)}
                                          />
                                      );
                                  })}
                              </SortableContext>
                          </DndContext>
                       </div>
                       
                       {/* Hidden Cards */}
                       <div className="space-y-1 pt-2">
                          <div className="text-xs font-medium text-muted-foreground mb-2">Hidden</div>
                          {cardOrder.filter(id => {
                              const card = allCards.find(c => c.id === id);
                              return !visibleCards[id] && card?.label.toLowerCase().includes(fieldSearch.toLowerCase());
                          }).map(id => {
                              const card = allCards.find(c => c.id === id);
                              return (
                                  <div key={id} className="flex items-center gap-3 py-2 px-2 group">
                                       <div className="w-4 h-4" /> {/* Spacer for grip */}
                                       <span className="text-sm font-medium flex-1 text-muted-foreground">{card?.label}</span>
                                       <Switch 
                                            checked={false}
                                            onCheckedChange={(checked) => toggleCardVisibility(id, checked)}
                                        />
                                  </div>
                              );
                          })}
                          {cardOrder.filter(id => !visibleCards[id]).length === 0 && (
                             <div className="text-xs text-muted-foreground italic px-2">No hidden cards</div>
                          )}
                       </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <Button variant="outline" onClick={() => setIsEditDrawerOpen(true)}>Edit Profile</Button>
              <ContactEditDrawer
                open={isEditDrawerOpen}
                onOpenChange={setIsEditDrawerOpen}
                contact={customer}
                onSave={handleSaveProfile}
              />
            </div>
          }
        />
      }
    >
      <div className="space-y-8 animate-in fade-in duration-500">
      
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="details" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Contact Details
          </TabsTrigger>
          <TabsTrigger 
            value="messaging" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Messaging
          </TabsTrigger>
          <TabsTrigger 
            value="notes" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
          >
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6 space-y-6">
          <div className={cn(
            "gap-6 space-y-6",
            columnCount === 1 ? "columns-1" : 
            columnCount === 2 ? "columns-1 md:columns-2" : 
            "columns-1 md:columns-2 lg:columns-3"
          )}>
            {cardOrder.map(cardId => {
               if (!visibleCards[cardId]) return null;

               // --- Custom Field Folders ---
               if (cardId.startsWith('folder-')) {
                 const folderId = cardId.split('-')[1];
                 const folder = MOCK_FOLDERS.find(f => f.id === folderId);
                 const fields = MOCK_FIELDS.filter(f => f.folderId === folderId);
                 
                 if (!folder || fields.length === 0) return null;

                 return (
                   <Card key={cardId} className="break-inside-avoid mb-6">
                     <CardHeader>
                       <CardTitle className="text-base">{folder.name}</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                       {fields.map(field => {
                          const value = customer[field.slug as keyof typeof customer];
                          if (value === undefined || value === null || value === '') return null;
                          
                          let displayValue = value;
                          if (field.type === 'date' && value) {
                             try {
                                 displayValue = format(new Date(value as string), "MMM d, yyyy");
                             } catch (e) {
                                 displayValue = value;
                             }
                          } else if (Array.isArray(value)) {
                              displayValue = Array.isArray(value) ? value.join(", ") : value;
                          }

                          return (
                            <div key={field.id} className="group flex items-start justify-between">
                               <div>
                                  <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">{field.name}</span>
                                  <span className="text-sm font-medium">{displayValue}</span>
                               </div>
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => setIsEditDrawerOpen(true)}
                               >
                                  <Pencil className="h-3 w-3 text-slate-400" />
                               </Button>
                            </div>
                          );
                       })}
                     </CardContent>
                   </Card>
                 );
               }
               
               // --- Additional Info (Uncategorized) ---
               if (cardId === 'card-additional') {
                  const fields = MOCK_FIELDS.filter(f => f.folderId === null);
                  const hasValues = fields.some(f => customer[f.slug as keyof typeof customer]);
                  
                  if (fields.length === 0 || !hasValues) return null;

                   return (
                      <Card key={cardId} className="break-inside-avoid mb-6">
                        <CardHeader>
                          <CardTitle className="text-base">Additional Info</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {fields.map(field => {
                             const value = customer[field.slug as keyof typeof customer];
                             if (!value) return null;
                             return (
                               <div key={field.id} className="group flex items-start justify-between">
                                  <div>
                                     <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">{field.name}</span>
                                     <span className="text-sm font-medium">{value}</span>
                                  </div>
                                  <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                      onClick={() => setIsEditDrawerOpen(true)}
                                  >
                                      <Pencil className="h-3 w-3 text-slate-400" />
                                  </Button>
                               </div>
                             );
                          })}
                        </CardContent>
                      </Card>
                   );
               }

               // --- System Details ---
               if (cardId === 'card-system') {
                 return (
                    <Card key={cardId} className="break-inside-avoid mb-6">
                      <CardHeader>
                        <CardTitle className="text-base">System Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">Join Date</span>
                          <span className="text-sm font-medium">{customer.joinDate}</span>
                        </div>
                         {Object.entries(customer.customData).map(([key, value]) => (
                          <div key={key}>
                            <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-1">{key}</span>
                            <span className="text-sm font-medium">{value}</span>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                 );
               }

               // --- Tags ---
               if (cardId === 'card-tags') {
                 return (
                  <Card key={cardId} className="break-inside-avoid mb-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-base">Tags</CardTitle>
                      <Popover open={tagPopoverOpen} onOpenChange={setTagPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-80" align="end">
                          <Command>
                            <CommandInput placeholder="Search tags..." value={tagSearch} onValueChange={setTagSearch} />
                            <CommandList>
                              <CommandEmpty>No tag found.</CommandEmpty>
                              <CommandGroup heading="Available Tags">
                                {allTags.filter(t => !customer.tags.includes(t)).map(tag => (
                                  <CommandItem 
                                    key={tag}
                                    onSelect={() => handleAddTag(tag)}
                                  >
                                    <Tag className="mr-2 h-3 w-3" />
                                    {tag}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {customer.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="group pr-1">
                            {tag}
                            <button 
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 h-3 w-3 rounded-full hover:bg-slate-200 inline-flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-2 w-2" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                 );
               }

               // --- Active Offers ---
               if (cardId === 'card-offers') {
                 return (
                  <Card key={cardId} className="break-inside-avoid mb-6">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-base">Active Offers</CardTitle>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-80" align="end">
                          <Command>
                            <CommandInput placeholder="Search offers..." />
                            <CommandList>
                              <CommandEmpty>No offers found.</CommandEmpty>
                              <CommandGroup heading="Available Offers">
                                {availableOffers.map(offer => (
                                  <CommandItem 
                                    key={offer.id}
                                    onSelect={() => handleAddOffer(offer)}
                                    className="flex flex-col items-start gap-1 p-2"
                                  >
                                    <span className="font-medium">{offer.title}</span>
                                    <span className="text-xs text-muted-foreground">{offer.description}</span>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {activeOffers.map(offer => (
                        <div key={offer.id} className="flex items-center justify-between p-2 rounded-lg border bg-slate-50 dark:bg-slate-900/50">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "h-8 w-8 rounded-full flex items-center justify-center",
                              offer.status === 'active' ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-500"
                            )}>
                              <Gift className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{offer.title}</p>
                              <p className="text-xs text-muted-foreground">{offer.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                 );
               }

               return null;
            })}
          </div>
        </TabsContent>

        <TabsContent value="messaging" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Main Chat/Activity Stream */}
            <div>
              <Card className="h-[500px] border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <CardHeader className="flex-none border-b">
                  <CardTitle className="text-base">Activity Stream</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto min-h-0 pt-6">
                  {/* Activity List */}
                  <div className="space-y-6 pr-2">
                    {activities.map((activity) => { 
                        const isRestaurant = activity.source === 'restaurant';
                        
                        return (
                          <div key={activity.id} className={cn(
                            "flex w-full gap-3",
                            isRestaurant ? "justify-start" : "justify-end"
                          )}>
                            {/* Avatar for Restaurant (Left) */}
                            {isRestaurant && (
                              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground shrink-0 mt-1 shadow-sm">
                                {activity.type === 'email' ? (
                                  <Mail className="h-4 w-4" />
                                ) : activity.type === 'sms' ? (
                                  <MessageSquare className="h-4 w-4" />
                                ) : activity.type === 'offer' ? (
                                  <Gift className="h-4 w-4" />
                                ) : activity.type === 'tag' ? (
                                  <Tag className="h-4 w-4" />
                                ) : activity.type === 'update' ? (
                                  <PenLine className="h-4 w-4" />
                                ) : activity.type === 'note' ? (
                                  <StickyNote className="h-4 w-4" />
                                ) : (
                                  <Store className="h-4 w-4" />
                                )}
                              </div>
                            )}

                            {/* Message Bubble */}
                            <div className={cn(
                              "max-w-[80%] rounded-2xl p-4 shadow-sm border",
                              isRestaurant 
                                ? "bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 border-zinc-200 dark:border-zinc-800 rounded-tl-none" 
                                : "bg-primary text-white border-primary/20 rounded-tr-none"
                            )}>
                              <div className="flex items-center justify-between gap-4 mb-1">
                                <span className={cn("text-xs font-bold uppercase tracking-wider opacity-80", isRestaurant ? "text-primary" : "text-white")}>
                                  {activity.title}
                                </span>
                                <time className={cn("text-[10px] opacity-60", isRestaurant ? "text-zinc-500 dark:text-zinc-400" : "text-white")}>
                                  {activity.date}
                                </time>
                              </div>
                              
                              <p className="text-sm leading-relaxed">
                                {activity.description}
                              </p>

                              {activity.meta && (
                                <div className={cn(
                                  "mt-3 text-xs font-mono py-1.5 px-2 rounded inline-flex items-center gap-1.5",
                                  isRestaurant 
                                    ? "bg-white dark:bg-black/20 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400" 
                                    : "bg-black/20 text-white/90"
                                )}>
                                  <DollarSign className="h-3 w-3" />
                                  {activity.meta}
                                </div>
                              )}
                            </div>

                            {/* Avatar for Customer (Right) */}
                            {!isRestaurant && (
                              <div className="h-8 w-8 rounded-full bg-white dark:bg-slate-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-400 shrink-0 mt-1 shadow-sm">
                                {activity.type === 'redemption' ? (
                                  <Ticket className="h-4 w-4" />
                                ) : activity.type === 'loyalty' ? (
                                  <MapPin className="h-4 w-4" />
                                ) : activity.type === 'activation' ? (
                                  <CreditCard className="h-4 w-4" />
                                ) : activity.type === 'review' ? (
                                  <Star className="h-4 w-4" />
                                ) : (
                                  <User className="h-4 w-4" />
                                )}
                              </div>
                            )}
                          </div>
                        );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Sidebar - Composer */}
            <div className="">
              <Card className="border-slate-200 dark:border-slate-800 shadow-sm h-[500px]">
                <CardHeader>
                  <CardTitle className="text-base">Send a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="email" onValueChange={setMessageType} className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4 shrink-0">
                        <TabsTrigger value="email">Email</TabsTrigger>
                        <TabsTrigger value="sms">SMS</TabsTrigger>
                      </TabsList>
                      
                      <div className="space-y-4">
                        <TabsContent value="email" className="mt-0 space-y-4">
                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground ml-1">From</Label>
                            <Select defaultValue="info@restaurant.com">
                              <SelectTrigger>
                                <SelectValue placeholder="Select email" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="info@restaurant.com">info@restaurant.com</SelectItem>
                                <SelectItem value="support@restaurant.com">support@restaurant.com</SelectItem>
                                <SelectItem value="manager@restaurant.com">manager@restaurant.com</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Input 
                            placeholder="Subject line..." 
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                            className="font-medium"
                          />
                          <Textarea 
                            placeholder={`Hi ${customer.firstName}, ...`}
                            className="min-h-[150px] resize-none text-base"
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                          />
                        </TabsContent>
                        
                        <TabsContent value="sms" className="mt-0 space-y-4">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 shrink-0">
                            <MessageSquare className="h-3 w-3" />
                            <span>SMS to {customer.phone}</span>
                          </div>
                          <Textarea 
                            placeholder="Type your SMS message here..." 
                            maxLength={160}
                            value={messageBody}
                            onChange={(e) => setMessageBody(e.target.value)}
                            className="min-h-[150px] resize-none text-base"
                          />
                        </TabsContent>

                        <div className="flex justify-between items-center pt-2 mt-2">
                          <div className="text-xs text-muted-foreground">
                            {messageType === 'sms' && `${messageBody.length}/160 chars`}
                          </div>
                          <Button 
                            onClick={handleSendMessage} 
                            disabled={!messageBody}
                            size="sm"
                            className="rounded-full px-6"
                          >
                            Send <Send className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground bg-amber-50 dark:bg-amber-950/20 p-3 rounded border border-amber-100 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
                Allergic to peanuts. Prefers booth seating near window.
              </div>
              <Button variant="outline" size="sm" className="w-full">Add Note</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </DashboardLayout>
  );
}