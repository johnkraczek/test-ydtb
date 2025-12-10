import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { 
    X, 
    Plus, 
    Save, 
    Trash, 
    User, 
    Mail, 
    Phone as PhoneIcon, 
    Calendar, 
    Tag,
    Check,
    ChevronDown,
    ChevronRight,
    Folder
} from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ContactEditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contact: any; // Using any for mockup simplicity
  onSave?: (data: any) => void;
}

interface CustomField {
    id: string;
    name: string;
    slug: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'multiselect';
    category: 'contact' | 'custom';
    folderId: string | null;
    description?: string;
    options?: string[]; // For select/multiselect
    required?: boolean;
}

interface FieldFolder {
    id: string;
    name: string;
}

export const MOCK_FOLDERS: FieldFolder[] = [
    { id: '1', name: 'General Info' },
    { id: '2', name: 'Sales Data' },
    { id: '3', name: 'Marketing' },
];

export const MOCK_FIELDS: CustomField[] = [
    { id: '1', name: 'Job Title', slug: 'job_title', type: 'text', category: 'custom', folderId: '1', description: 'Current job title' },
    { id: '2', name: 'Company Size', slug: 'company_size', type: 'select', category: 'custom', folderId: '2', options: ['1-10', '11-50', '50+'] },
    { id: '3', name: 'Annual Revenue', slug: 'annual_revenue', type: 'number', category: 'custom', folderId: '2' },
    { id: '4', name: 'Lead Source Detail', slug: 'lead_source_detail', type: 'text', category: 'custom', folderId: '3' },
    { id: '5', name: 'Interests', slug: 'interests', type: 'multiselect', category: 'custom', folderId: '3', options: ['Product A', 'Product B', 'Consulting'] },
    { id: '6', name: 'Contract Start Date', slug: 'contract_start_date', type: 'date', category: 'custom', folderId: '2' },
    { id: '7', name: 'Uncategorized Field', slug: 'uncategorized_field', type: 'text', category: 'custom', folderId: null },
];

const AVAILABLE_TAGS = [
    "Customer", 
    "Lead", 
    "VIP", 
    "Partner", 
    "Vendor", 
    "New", 
    "Inactive", 
    "Referral", 
    "Enterprise", 
    "Small Business",
    "Qualified",
    "Negotiation",
    "Lost",
    "Churned"
];

export function ContactEditDrawer({ open, onOpenChange, contact, onSave }: ContactEditDrawerProps) {
  const [formData, setFormData] = useState<any>({});
  const [openCombobox, setOpenCombobox] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  useEffect(() => {
    if (contact) {
      setFormData({ ...contact });
    }
  }, [contact]);

  if (!contact) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const toggleFolder = (folderId: string) => {
    if (expandedFolders.includes(folderId)) {
        setExpandedFolders(expandedFolders.filter(id => id !== folderId));
    } else {
        setExpandedFolders([...expandedFolders, folderId]);
    }
  };

  const getFieldsByFolder = (folderId: string | null) => {
    return MOCK_FIELDS.filter(f => f.folderId === folderId);
  };

  const renderCustomField = (field: CustomField) => {
    const value = formData[field.slug];

    switch (field.type) {
        case 'select':
            return (
                <Select 
                    value={value || ''} 
                    onValueChange={(val) => handleInputChange(field.slug, val)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map(opt => (
                            <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        case 'multiselect':
            // Simplified multiselect for mockup - just a text input or comma separated
            // Or maybe a multiple select if UI supports it, but standard Select doesn't support multiple easily without custom component
            // Let's use a simple multiple checkbox list or just Render as checkboxes
            return (
                <div className="space-y-2 border rounded-md p-3">
                    {field.options?.map(opt => {
                        const currentValues = Array.isArray(value) ? value : [];
                        const isChecked = currentValues.includes(opt);
                        return (
                            <div key={opt} className="flex items-center space-x-2">
                                <Checkbox 
                                    id={`${field.slug}-${opt}`} 
                                    checked={isChecked}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            handleInputChange(field.slug, [...currentValues, opt]);
                                        } else {
                                            handleInputChange(field.slug, currentValues.filter((v: string) => v !== opt));
                                        }
                                    }}
                                />
                                <Label htmlFor={`${field.slug}-${opt}`} className="font-normal cursor-pointer">{opt}</Label>
                            </div>
                        );
                    })}
                </div>
            );
        case 'checkbox':
            return (
                <div className="flex items-center space-x-2 h-10">
                    <Checkbox 
                        id={field.slug} 
                        checked={!!value}
                        onCheckedChange={(checked) => handleInputChange(field.slug, !!checked)}
                    />
                    <Label htmlFor={field.slug} className="font-normal cursor-pointer">Yes</Label>
                </div>
            );
        case 'date':
            return (
                <div className="relative">
                    <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        id={field.slug}
                        className="pl-9"
                        type="date"
                        value={value ? new Date(value).toISOString().split('T')[0] : ''} 
                        onChange={(e) => handleInputChange(field.slug, e.target.value)}
                    />
                </div>
            );
        case 'number':
            return (
                <Input 
                    id={field.slug}
                    type="number"
                    value={value || ''} 
                    onChange={(e) => handleInputChange(field.slug, e.target.value)}
                />
            );
        default: // text
            return (
                <Input 
                    id={field.slug}
                    value={value || ''} 
                    onChange={(e) => handleInputChange(field.slug, e.target.value)}
                />
            );
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tag.trim()]
      });
      setSearchValue("");
      setOpenCombobox(false);
    }
  };

  const filteredTags = AVAILABLE_TAGS.filter(tag => 
    !formData.tags?.includes(tag) && 
    tag.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[680px] sm:w-[680px] p-0 flex flex-col">
        <SheetHeader className="px-6 py-6 border-b bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-white dark:border-slate-800 shadow-sm">
              <AvatarImage src={formData.image} />
              <AvatarFallback className="text-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                {formData.initials}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <SheetTitle className="text-xl">{formData.name}</SheetTitle>
              <div className="text-sm text-slate-500 flex items-center gap-2">
                <span className="truncate max-w-[200px]">{formData.email}</span>
                <span>•</span>
                <span className="capitalize">{formData.role || 'Contact'}</span>
              </div>
            </div>
          </div>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Contact Details */}
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-400" />
                    Contact Information
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input 
                                id="name" 
                                value={formData.name || ''} 
                                onChange={(e) => handleInputChange('name', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="source">Source</Label>
                            <Input 
                                id="source" 
                                value={formData.source || ''} 
                                onChange={(e) => handleInputChange('source', e.target.value)}
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                id="email" 
                                className="pl-9"
                                value={formData.email || ''} 
                                onChange={(e) => handleInputChange('email', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                            <PhoneIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                id="phone" 
                                className="pl-9"
                                value={formData.phone || ''} 
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <div className="relative">
                                <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input 
                                    id="dob" 
                                    className="pl-9"
                                    type="date"
                                    value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} 
                                    onChange={(e) => handleInputChange('dob', e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Input 
                                id="type" 
                                value={formData.type || ''} 
                                onChange={(e) => handleInputChange('type', e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Tags Section */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <Tag className="h-4 w-4 text-slate-400" />
                        Tags
                    </h3>
                </div>
                
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-800 space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {formData.tags && formData.tags.length > 0 ? (
                            formData.tags.map((tag: string) => (
                                <Badge 
                                    key={tag} 
                                    variant="secondary"
                                    className="pl-2 pr-1 py-1 h-7 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-300 gap-1"
                                >
                                    {tag}
                                    <button 
                                        onClick={() => handleRemoveTag(tag)}
                                        className="h-4 w-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-3 w-3 text-slate-400" />
                                    </button>
                                </Badge>
                            ))
                        ) : (
                            <span className="text-sm text-slate-500 italic">No tags added yet</span>
                        )}
                    </div>
                    
                    <div className="flex gap-2">
                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openCombobox}
                                    className="justify-between text-slate-500 font-normal w-full"
                                >
                                    Add a tag...
                                    <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0" align="start">
                                <Command>
                                    <CommandInput 
                                        placeholder="Search tags..." 
                                        value={searchValue}
                                        onValueChange={setSearchValue}
                                    />
                                    <CommandList>
                                        <CommandEmpty className="py-2 px-2">
                                            {searchValue ? (
                                                <button 
                                                    className="flex items-center gap-2 text-sm text-indigo-600 w-full p-2 hover:bg-indigo-50 rounded-md transition-colors"
                                                    onClick={() => handleAddTag(searchValue)}
                                                >
                                                    <Plus className="h-3.5 w-3.5" />
                                                    Create tag: <span className="font-medium">"{searchValue}"</span>
                                                </button>
                                            ) : (
                                                <span className="text-sm text-slate-500 p-2">No tags found.</span>
                                            )}
                                        </CommandEmpty>
                                        <CommandGroup>
                                            {filteredTags.map((tag) => (
                                                <CommandItem
                                                    key={tag}
                                                    value={tag}
                                                    onSelect={() => handleAddTag(tag)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            formData.tags?.includes(tag) ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {tag}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </section>

            <Separator />

            {/* Custom Fields Section */}
            <section className="space-y-4">
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <Folder className="h-4 w-4 text-slate-400" />
                    Custom Fields
                </h3>

                <div className="space-y-2">
                    {/* Folders */}
                    {MOCK_FOLDERS.map(folder => {
                        const fields = getFieldsByFolder(folder.id);
                        if (fields.length === 0) return null;
                        const isExpanded = expandedFolders.includes(folder.id);

                        return (
                            <div key={folder.id} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button 
                                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                                    onClick={() => toggleFolder(folder.id)}
                                >
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{folder.name}</span>
                                        <Badge variant="secondary" className="ml-2 text-[10px] h-5 bg-white dark:bg-slate-800">
                                            {fields.length} fields
                                        </Badge>
                                    </div>
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                        {fields.map(field => (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={field.slug}>{field.name}</Label>
                                                {renderCustomField(field)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Uncategorized Fields */}
                    {(() => {
                        const fields = getFieldsByFolder(null);
                        if (fields.length === 0) return null;
                        const isExpanded = expandedFolders.includes('uncategorized');
                        
                        return (
                            <div className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                                <button 
                                    className="w-full flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                                    onClick={() => toggleFolder('uncategorized')}
                                >
                                    <div className="flex items-center gap-2">
                                        {isExpanded ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
                                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Uncategorized Fields</span>
                                        <Badge variant="secondary" className="ml-2 text-[10px] h-5 bg-white dark:bg-slate-800">
                                            {fields.length} fields
                                        </Badge>
                                    </div>
                                </button>
                                
                                {isExpanded && (
                                    <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 space-y-4">
                                        {fields.map(field => (
                                            <div key={field.id} className="space-y-2">
                                                <Label htmlFor={field.slug}>{field.name}</Label>
                                                {renderCustomField(field)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            </section>
        </div>

        <div className="p-6 border-t bg-white dark:bg-slate-900 mt-auto flex items-center justify-between">
            <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10">
                <Trash className="h-4 w-4 mr-2" />
                Delete Contact
            </Button>
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                <Button 
                    className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
                    onClick={() => {
                        onSave?.(formData);
                        onOpenChange(false);
                    }}
                >
                    <Save className="h-4 w-4" />
                    Save Changes
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
