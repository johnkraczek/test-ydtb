import React, { useState } from 'react';
import DashboardLayout from "@/components/dashboard/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
    Search, 
    Plus, 
    MoreHorizontal, 
    Folder, 
    FileText, 
    Pencil, 
    Trash, 
    ChevronRight, 
    ChevronDown,
    FolderPlus,
    LayoutGrid,
    List,
    Type,
    Hash,
    Calendar as CalendarIcon,
    CheckSquare,
    ArrowUp,
    ArrowDown,
    ArrowUpDown,
    AlignLeft
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

interface CustomField {
    id: string;
    name: string;
    slug: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'multiselect';
    folderId: string | null;
    description?: string;
    options?: string[]; // For select/multiselect
    required?: boolean;
}

interface FieldFolder {
    id: string;
    name: string;
}

const FIELD_TYPES = [
    { value: 'text', label: 'Text', icon: Type },
    { value: 'number', label: 'Number', icon: Hash },
    { value: 'date', label: 'Date', icon: CalendarIcon },
    { value: 'select', label: 'Single Select', icon: List },
    { value: 'multiselect', label: 'Multi Select', icon: CheckSquare },
    { value: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { value: 'textarea', label: 'Long Text', icon: AlignLeft },
];

export default function CustomFieldsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [folders, setFolders] = useState<FieldFolder[]>([
        { id: '1', name: 'General Info' },
        { id: '2', name: 'Sales Data' },
        { id: '3', name: 'Marketing' },
    ]);
    
    const [fields, setFields] = useState<CustomField[]>([
        { id: '1', name: 'Job Title', slug: 'job_title', type: 'text', folderId: '1', description: 'Current job title' },
        { id: '2', name: 'Company Size', slug: 'company_size', type: 'select', folderId: '2', options: ['1-10', '11-50', '50+'] },
        { id: '3', name: 'Annual Revenue', slug: 'annual_revenue', type: 'number', folderId: '2' },
        { id: '4', name: 'Lead Source Detail', slug: 'lead_source_detail', type: 'text', folderId: '3' },
        { id: '5', name: 'Interests', slug: 'interests', type: 'multiselect', folderId: '3', options: ['Product A', 'Product B', 'Consulting'] },
        { id: '6', name: 'Contract Start Date', slug: 'contract_start_date', type: 'date', folderId: '2' },
        { id: '7', name: 'Uncategorized Field', slug: 'uncategorized_field', type: 'text', folderId: null },
    ]);

    const [expandedFolders, setExpandedFolders] = useState<string[]>(['1', '2', '3']);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    // Sorting state
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Field editing state
    const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
    const [fieldFormData, setFieldFormData] = useState<Partial<CustomField>>({ 
        type: 'text', 
        folderId: '1',
        id: '',
        slug: ''
    });

    const toggleFolder = (folderId: string) => {
        if (expandedFolders.includes(folderId)) {
            setExpandedFolders(expandedFolders.filter(id => id !== folderId));
        } else {
            setExpandedFolders([...expandedFolders, folderId]);
        }
    };

    const handleCreateFolder = () => {
        if (newFolderName.trim()) {
            setFolders([...folders, { id: Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0'), name: newFolderName }]);
            setNewFolderName("");
            setIsCreateFolderOpen(false);
        }
    };

    const openCreateFieldDialog = () => {
        setEditingFieldId(null);
        setFieldFormData({ 
            type: 'text', 
            folderId: '1',
            id: Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0'),
            slug: ''
        });
        setIsCreateFieldOpen(true);
    };

    const openEditFieldDialog = (field: CustomField) => {
        setEditingFieldId(field.id);
        setFieldFormData({ ...field });
        setIsCreateFieldOpen(true);
    };

    const handleSaveField = () => {
        if (fieldFormData.name) {
            if (editingFieldId) {
                // Update existing
                setFields(fields.map(f => f.id === editingFieldId ? { 
                    ...f, 
                    name: fieldFormData.name!,
                    // Type is fixed on edit
                    // Slug is fixed on edit
                    folderId: fieldFormData.folderId || null,
                    description: fieldFormData.description,
                    options: fieldFormData.options,
                    required: fieldFormData.required
                } : f));
            } else {
                // Create new
                // Generate slug if empty
                const generatedSlug = fieldFormData.slug || fieldFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                
                setFields([...fields, { 
                    id: fieldFormData.id || Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0'), 
                    name: fieldFormData.name,
                    slug: generatedSlug,
                    type: fieldFormData.type as any || 'text',
                    folderId: fieldFormData.folderId || null,
                    description: fieldFormData.description,
                    options: fieldFormData.options,
                    required: fieldFormData.required
                }]);
            }
            setIsCreateFieldOpen(false);
        }
    };

    const deleteFolder = (id: string) => {
        setFolders(folders.filter(f => f.id !== id));
        // Move fields to uncategorized (null folder)
        setFields(fields.map(f => f.folderId === id ? { ...f, folderId: null } : f));
    };

    const deleteField = (id: string) => {
        setFields(fields.filter(f => f.id !== id));
    };


    const getFieldIcon = (type: string) => {
        const typeObj = FIELD_TYPES.find(t => t.value === type);
        const Icon = typeObj ? typeObj.icon : Type;
        return <Icon className="h-4 w-4 text-slate-500" />;
    };

    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const filteredFields = fields.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        let aValue: any = a[sortColumn as keyof CustomField] || '';
        let bValue: any = b[sortColumn as keyof CustomField] || '';

        // Handle special cases
        if (sortColumn === 'folder') {
            const folderA = folders.find(f => f.id === a.folderId)?.name || 'Uncategorized';
            const folderB = folders.find(f => f.id === b.folderId)?.name || 'Uncategorized';
            aValue = folderA;
            bValue = folderB;
        }

        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    const groupedFields: Record<string, CustomField[]> = {
        uncategorized: filteredFields.filter(f => !f.folderId),
        ...folders.reduce((acc, folder) => ({
            ...acc,
            [folder.id]: filteredFields.filter(f => f.folderId === folder.id)
        }), {} as Record<string, CustomField[]>)
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
        <Tabs defaultValue="list" className="h-full flex flex-col">
            <DashboardLayout activeTool="users" header={
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Custom Fields</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and organize custom data fields for your contacts</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <TabsList className="mr-2">
                            <TabsTrigger value="list" className="px-3"><List className="h-4 w-4" /></TabsTrigger>
                            <TabsTrigger value="folders" className="px-3"><Folder className="h-4 w-4" /></TabsTrigger>
                        </TabsList>

                        <div className="relative mr-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input 
                                className="pl-9 w-[250px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800" 
                                placeholder="Search fields..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        
                        <Dialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-2 bg-white dark:bg-slate-900">
                                <FolderPlus className="h-4 w-4" />
                                New Folder
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create New Folder</DialogTitle>
                                <DialogDescription>
                                    Create a folder to organize your custom fields.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="folder-name" className="mb-2 block">Folder Name</Label>
                                <Input 
                                    id="folder-name" 
                                    placeholder="e.g. Sales Metrics" 
                                    value={newFolderName}
                                    onChange={(e) => setNewFolderName(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateFolderOpen(false)}>Cancel</Button>
                                <Button onClick={handleCreateFolder} disabled={!newFolderName.trim()}>Create Folder</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isCreateFieldOpen} onOpenChange={setIsCreateFieldOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm shadow-indigo-200 dark:shadow-none" onClick={openCreateFieldDialog}>
                                <Plus className="h-4 w-4" />
                                Add Field
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingFieldId ? 'Edit Custom Field' : 'Create Custom Field'}</DialogTitle>
                                <DialogDescription>
                                    {editingFieldId ? 'Modify existing custom field properties.' : 'Add a new field to capture specific data about your contacts.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="field-name">Field Name</Label>
                                    <Input 
                                        id="field-name" 
                                        placeholder="e.g. T-Shirt Size" 
                                        value={fieldFormData.name || ''}
                                        onChange={(e) => setFieldFormData({...fieldFormData, name: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="field-slug">Field Slug</Label>
                                        <Input 
                                            id="field-slug" 
                                            placeholder="e.g. t_shirt_size" 
                                            value={fieldFormData.slug || ''}
                                            onChange={(e) => setFieldFormData({...fieldFormData, slug: e.target.value})}
                                            disabled={!!editingFieldId}
                                            className={editingFieldId ? "bg-slate-100 text-slate-500" : ""}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="field-id">Field ID</Label>
                                        <Input 
                                            id="field-id" 
                                            value={fieldFormData.id || ''}
                                            disabled={true}
                                            className="bg-slate-100 text-slate-500 font-mono text-xs"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="field-type">Field Type</Label>
                                        <Select 
                                            value={fieldFormData.type} 
                                            onValueChange={(val: any) => setFieldFormData({...fieldFormData, type: val})}
                                            disabled={!!editingFieldId}
                                        >
                                            <SelectTrigger className={editingFieldId ? "bg-slate-100 text-slate-500 opacity-100" : ""}>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {FIELD_TYPES.map(type => (
                                                    <SelectItem key={type.value} value={type.value}>
                                                        <div className="flex items-center gap-2">
                                                            <type.icon className="h-4 w-4" />
                                                            {type.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label htmlFor="field-folder">Folder</Label>
                                        <Select 
                                            value={fieldFormData.folderId || "uncategorized"} 
                                            onValueChange={(val) => setFieldFormData({...fieldFormData, folderId: val === "uncategorized" ? null : val})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select folder" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                                                {folders.map(folder => (
                                                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="field-desc">Description (Optional)</Label>
                                    <Input 
                                        id="field-desc" 
                                        placeholder="What is this field used for?" 
                                        value={fieldFormData.description || ''}
                                        onChange={(e) => setFieldFormData({...fieldFormData, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateFieldOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveField} disabled={!fieldFormData.name}>
                                    {editingFieldId ? 'Save Changes' : 'Create Field'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        }>
            <div className="h-full flex flex-col">
                    <TabsContent value="folders" className="flex-1 overflow-auto bg-slate-50/50 dark:bg-slate-900/30 p-6 mt-0">
                        <div className="max-w-5xl mx-auto space-y-6">
                            {/* Folders List */}
                            <div className="space-y-4">
                            {folders.map(folder => (
                                <div key={folder.id} className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                    <div 
                                        className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                                        onClick={() => toggleFolder(folder.id)}
                                    >
                                        <div className="flex items-center gap-2">
                                            {expandedFolders.includes(folder.id) ? (
                                                <ChevronDown className="h-4 w-4 text-slate-500" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4 text-slate-500" />
                                            )}
                                            <Folder className="h-4 w-4 text-indigo-500" />
                                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{folder.name}</span>
                                            <Badge variant="secondary" className="ml-2 text-[10px] h-5">
                                                {groupedFields[folder.id]?.length || 0} fields
                                            </Badge>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>Rename Folder</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteFolder(folder.id)}>
                                                    Delete Folder
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>

                                    {expandedFolders.includes(folder.id) && (
                                        <div className="border-t border-slate-100 dark:border-slate-800">
                                            {groupedFields[folder.id]?.length > 0 ? (
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                                                            <TableHead className="w-[30%] text-xs font-medium">Field Name</TableHead>
                                                            <TableHead className="w-[20%] text-xs font-medium">Type</TableHead>
                                                            <TableHead className="w-[40%] text-xs font-medium">Description</TableHead>
                                                            <TableHead className="w-[10%] text-xs font-medium"></TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {groupedFields[folder.id].map(field => (
                                                            <TableRow key={field.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                                                <TableCell className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                                    {field.name}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                        {getFieldIcon(field.type)}
                                                                        <span className="capitalize">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</span>
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-slate-500 truncate max-w-[200px]">
                                                                    {field.description || '-'}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => openEditFieldDialog(field)}>Edit Field</DropdownMenuItem>
                                                                            <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className="text-red-600" onClick={() => deleteField(field.id)}>
                                                                                Delete Field
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            ) : (
                                                <div className="py-8 text-center text-sm text-slate-500 italic">
                                                    No fields in this folder yet.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Uncategorized Fields */}
                            {groupedFields.uncategorized?.length > 0 && (
                                <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
                                    <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-400" />
                                            <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Uncategorized Fields</span>
                                            <Badge variant="secondary" className="ml-2 text-[10px] h-5">
                                                {groupedFields.uncategorized.length} fields
                                            </Badge>
                                        </div>
                                    </div>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                                                <TableHead className="w-[30%] text-xs font-medium">Field Name</TableHead>
                                                <TableHead className="w-[20%] text-xs font-medium">Type</TableHead>
                                                <TableHead className="w-[40%] text-xs font-medium">Description</TableHead>
                                                <TableHead className="w-[10%] text-xs font-medium"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {groupedFields.uncategorized.map(field => (
                                                <TableRow key={field.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                                    <TableCell className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                        {field.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                            {getFieldIcon(field.type)}
                                                            <span className="capitalize">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-500 truncate max-w-[200px]">
                                                        {field.description || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem>Edit Field</DropdownMenuItem>
                                                                <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteField(field.id)}>
                                                                    Delete Field
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </div>
                </TabsContent>

                    <TabsContent value="list" className="mt-0">
                        <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                            <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                                            <SortableHeader column="name" label="Field Name" className="w-[30%] text-xs font-medium" />
                                            <SortableHeader column="type" label="Type" className="w-[20%] text-xs font-medium" />
                                            <SortableHeader column="folder" label="Folder" className="w-[15%] text-xs font-medium" />
                                            <SortableHeader column="description" label="Description" className="w-[25%] text-xs font-medium" />
                                            <TableHead className="w-[10%] text-xs font-medium"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredFields.length > 0 ? (
                                            filteredFields.map(field => {
                                                const folderName = folders.find(f => f.id === field.folderId)?.name || 'Uncategorized';
                                                return (
                                                    <TableRow key={field.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                                        <TableCell className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                            {field.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                                {getFieldIcon(field.type)}
                                                                <span className="capitalize">{FIELD_TYPES.find(t => t.value === field.type)?.label || field.type}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className="font-normal text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
                                                                {folderName}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-slate-500 truncate max-w-[200px]">
                                                            {field.description || '-'}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuItem onClick={() => openEditFieldDialog(field)}>Edit Field</DropdownMenuItem>
                                                                    <DropdownMenuItem>Move to Folder</DropdownMenuItem>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem className="text-red-600" onClick={() => deleteField(field.id)}>
                                                                        Delete Field
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={5} className="h-24 text-center text-sm text-slate-500 italic">
                                                    No fields found.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                    </TabsContent>
                </div>
            </DashboardLayout>
        </Tabs>
    );
}
