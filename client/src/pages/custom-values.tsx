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
    AlignLeft,
    Copy,
    X,
    FolderInput,
    Check
} from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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

interface CustomValue {
    id: string;
    name: string;
    slug: string;
    value: string;
    folderId: string | null;
    description?: string;
}

interface ValueFolder {
    id: string;
    name: string;
}

export default function CustomValuesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [folders, setFolders] = useState<ValueFolder[]>([
        { id: '1', name: 'Company Info' },
        { id: '2', name: 'Links' },
        { id: '3', name: 'Legal' },
    ]);
    
    const [values, setValues] = useState<CustomValue[]>([
        { id: '1', name: 'Company Name', slug: 'name', value: 'Acme Corp', folderId: '1', description: 'Official company name' },
        { id: '2', name: 'Support Email', slug: 'support_email', value: 'support@acme.com', folderId: '1' },
        { id: '3', name: 'Website URL', slug: 'website_url', value: 'https://acme.com', folderId: '2' },
        { id: '4', name: 'Privacy Policy URL', slug: 'privacy_policy', value: 'https://acme.com/privacy', folderId: '3' },
        { id: '5', name: 'Terms of Service URL', slug: 'terms_of_service', value: 'https://acme.com/terms', folderId: '3' },
        { id: '6', name: 'Phone Number', slug: 'phone_number', value: '+1 (555) 123-4567', folderId: '1' },
        { id: '7', name: 'Address', slug: 'address', value: '123 Market St, San Francisco, CA', folderId: '1' },
        { id: '8', name: 'Calendar Booking Link', slug: 'booking_link', value: 'https://cal.com/acme/demo', folderId: '2' },
    ]);

    const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);
    const [isCreateValueOpen, setIsCreateValueOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState("");
    
    // Sorting state
    const [sortColumn, setSortColumn] = useState<string>('name');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    // Value editing state
    const [editingValueId, setEditingValueId] = useState<string | null>(null);
    const [valueFormData, setValueFormData] = useState<Partial<CustomValue>>({ 
        folderId: '1',
        id: '',
        slug: '',
        value: ''
    });

    // Move to Folder state
    const [isMoveToFolderOpen, setIsMoveToFolderOpen] = useState(false);
    const [movingValueId, setMovingValueId] = useState<string | null>(null);
    const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
    const [folderToDelete, setFolderToDelete] = useState<string | null>(null);
    const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
    const [editingFolderName, setEditingFolderName] = useState("");

    // Inline editing state
    const [editingCellId, setEditingCellId] = useState<string | null>(null);
    const [editingCellValue, setEditingCellValue] = useState("");

    const startEditingCell = (value: CustomValue) => {
        setEditingCellId(value.id);
        setEditingCellValue(value.value);
    };

    const saveCellEdit = () => {
        if (editingCellId) {
            setValues(values.map(v => v.id === editingCellId ? { ...v, value: editingCellValue } : v));
            setEditingCellId(null);
            setEditingCellValue("");
            toast.success("Value updated");
        }
    };

    const cancelCellEdit = () => {
        setEditingCellId(null);
        setEditingCellValue("");
    };

    const handleCellKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            saveCellEdit();
        } else if (e.key === 'Escape') {
            cancelCellEdit();
        }
    };

    // Selection state
    const [selectedValues, setSelectedValues] = useState<string[]>([]);

    const toggleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedValues(filteredValues.map(f => f.id));
        } else {
            setSelectedValues([]);
        }
    };

    const toggleSelectValue = (valueId: string, checked: boolean) => {
        if (checked) {
            setSelectedValues([...selectedValues, valueId]);
        } else {
            setSelectedValues(selectedValues.filter(id => id !== valueId));
        }
    };

    const toggleSelectGroup = (groupValues: CustomValue[], checked: boolean) => {
        const groupIds = groupValues.map(f => f.id);
        if (checked) {
             setSelectedValues(prev => [...new Set([...prev, ...groupIds])]);
        } else {
             setSelectedValues(prev => prev.filter(id => !groupIds.includes(id)));
        }
    };

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

    const openCreateValueDialog = () => {
        setEditingValueId(null);
        setValueFormData({ 
            folderId: '1',
            id: Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0'),
            slug: '',
            value: ''
        });
        setIsCreateValueOpen(true);
    };

    const openEditValueDialog = (value: CustomValue) => {
        setEditingValueId(value.id);
        setValueFormData({ ...value });
        setIsCreateValueOpen(true);
    };

    const openMoveToFolderDialog = (value: CustomValue) => {
        setMovingValueId(value.id);
        setSelectedFolderId(value.folderId);
        setIsMoveToFolderOpen(true);
    };

    const openBulkMoveDialog = () => {
        setMovingValueId(null);
        setSelectedFolderId(null);
        setIsMoveToFolderOpen(true);
    };

    const handleMoveToFolder = () => {
        if (movingValueId) {
            setValues(values.map(f => f.id === movingValueId ? { ...f, folderId: selectedFolderId } : f));
            setMovingValueId(null);
            toast.success("Value moved successfully");
        } else if (selectedValues.length > 0) {
            setValues(values.map(f => selectedValues.includes(f.id) ? { ...f, folderId: selectedFolderId } : f));
            setSelectedValues([]);
            toast.success(`${selectedValues.length} values moved successfully`);
        }
        setIsMoveToFolderOpen(false);
        setSelectedFolderId(null);
    };

    const handleBulkDelete = () => {
        if (selectedValues.length > 0) {
            setValues(values.filter(f => !selectedValues.includes(f.id)));
            setSelectedValues([]);
            toast.success("Values deleted successfully");
        }
    };

    const handleSaveValue = () => {
        if (valueFormData.name) {
            if (editingValueId) {
                // Update existing
                setValues(values.map(f => f.id === editingValueId ? { 
                    ...f, 
                    name: valueFormData.name!,
                    slug: valueFormData.slug || f.slug,
                    value: valueFormData.value || '',
                    folderId: valueFormData.folderId || null,
                    description: valueFormData.description,
                } : f));
            } else {
                // Create new
                // Generate slug if empty
                const generatedSlug = valueFormData.slug || valueFormData.name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
                
                setValues([...values, { 
                    id: valueFormData.id || Math.floor(Math.random() * 0xFFFFFFF).toString(16).padStart(7, '0'), 
                    name: valueFormData.name,
                    slug: generatedSlug,
                    value: valueFormData.value || '',
                    folderId: valueFormData.folderId || null,
                    description: valueFormData.description,
                }]);
            }
            setIsCreateValueOpen(false);
        }
    };

    const confirmDeleteFolder = () => {
        if (folderToDelete) {
            setFolders(folders.filter(f => f.id !== folderToDelete));
            // Move values to uncategorized (null folder)
            setValues(values.map(f => f.folderId === folderToDelete ? { ...f, folderId: null } : f));
            setFolderToDelete(null);
            toast.success("Folder deleted successfully");
        }
    };

    const deleteValue = (id: string) => {
        setValues(values.filter(f => f.id !== id));
    };

    const startEditingFolder = (folder: ValueFolder) => {
        setEditingFolderId(folder.id);
        setEditingFolderName(folder.name);
    };

    const saveFolderRename = (e: React.MouseEvent | React.KeyboardEvent) => {
        e.stopPropagation();
        if (editingFolderId && editingFolderName.trim()) {
            setFolders(folders.map(f => f.id === editingFolderId ? { ...f, name: editingFolderName } : f));
            setEditingFolderId(null);
            setEditingFolderName("");
            toast.success("Folder renamed successfully");
        }
    };

    const cancelEditingFolder = (e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingFolderId(null);
        setEditingFolderName("");
    };


    const handleSort = (column: string) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard");
    };

    const filteredValues = values.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.value.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => {
        let aValue: any = a[sortColumn as keyof CustomValue] || '';
        let bValue: any = b[sortColumn as keyof CustomValue] || '';

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

    const groupedValues: Record<string, CustomValue[]> = {
        uncategorized: filteredValues.filter(f => !f.folderId),
        ...folders.reduce((acc, folder) => ({
            ...acc,
            [folder.id]: filteredValues.filter(f => f.folderId === folder.id)
        }), {} as Record<string, CustomValue[]>)
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
            <DashboardLayout activeTool="settings" header={
                <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 tracking-tight">Custom Values</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global values available across your account</p>
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
                                placeholder="Search values..." 
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
                                    Create a folder to organize your custom values.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="folder-name" className="mb-2 block">Folder Name</Label>
                                <Input 
                                    id="folder-name" 
                                    placeholder="e.g. Company Links" 
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

                    <Dialog open={isCreateValueOpen} onOpenChange={setIsCreateValueOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 shadow-sm shadow-indigo-200 dark:shadow-none" onClick={openCreateValueDialog}>
                                <Plus className="h-4 w-4" />
                                Add Value
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                                <DialogTitle>{editingValueId ? 'Edit Custom Value' : 'Create Custom Value'}</DialogTitle>
                                <DialogDescription>
                                    {editingValueId ? 'Modify existing custom value.' : 'Add a new global value to use in your templates.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="value-name">Name</Label>
                                    <Input 
                                        id="value-name" 
                                        placeholder="e.g. Support Email" 
                                        value={valueFormData.name || ''}
                                        onChange={(e) => setValueFormData({...valueFormData, name: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="value-content">Value</Label>
                                    <Input 
                                        id="value-content" 
                                        placeholder="e.g. support@acme.com" 
                                        value={valueFormData.value || ''}
                                        onChange={(e) => setValueFormData({...valueFormData, value: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="value-slug">Key</Label>
                                        <div className="relative">
                                            <Input 
                                                id="value-slug" 
                                                placeholder="support_email" 
                                                value={valueFormData.slug || ''}
                                                onChange={(e) => setValueFormData({...valueFormData, slug: e.target.value})}
                                                disabled={!!editingValueId}
                                                className={editingValueId ? "bg-slate-100 text-slate-500 pl-16" : "pl-16"}
                                            />
                                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-mono pointer-events-none">
                                                company.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="value-folder">Folder</Label>
                                        <Select 
                                            value={valueFormData.folderId || "uncategorized"} 
                                            onValueChange={(val) => setValueFormData({...valueFormData, folderId: val === "uncategorized" ? null : val})}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Folder" />
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
                                    <Label htmlFor="value-description">Description</Label>
                                    <Input 
                                        id="value-description" 
                                        placeholder="Optional description" 
                                        value={valueFormData.description || ''}
                                        onChange={(e) => setValueFormData({...valueFormData, description: e.target.value})}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsCreateValueOpen(false)}>Cancel</Button>
                                <Button onClick={handleSaveValue} disabled={!valueFormData.name}>Save Value</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                    </div>
                </div>
            }>
                <TabsContent value="list" className="flex-1 p-0 m-0 outline-none">
                    <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                        {selectedValues.length > 0 && (
                            <div className="flex items-center justify-between px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 border-b border-indigo-100 dark:border-indigo-800/50">
                                <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
                                    {selectedValues.length} values selected
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" className="h-8 border-indigo-200 hover:bg-indigo-100 text-indigo-700" onClick={openBulkMoveDialog}>
                                        <Folder className="mr-2 h-3.5 w-3.5" />
                                        Move to Folder
                                    </Button>
                                    <Button variant="outline" size="sm" className="h-8 border-red-200 hover:bg-red-50 text-red-600 hover:text-red-700" onClick={handleBulkDelete}>
                                        <Trash className="mr-2 h-3.5 w-3.5" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[40px] pl-4">
                                        <Checkbox 
                                            checked={selectedValues.length === filteredValues.length && filteredValues.length > 0}
                                            onCheckedChange={toggleSelectAll}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                    <SortableHeader column="name" label="Name" className="w-[200px]" />
                                    <SortableHeader column="slug" label="Key" className="w-[250px]" />
                                    <SortableHeader column="value" label="Value" className="min-w-[200px]" />
                                    <SortableHeader column="folder" label="Folder" className="w-[150px]" />
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredValues.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            No custom values found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredValues.map((value) => (
                                        <TableRow key={value.id} className="group hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                            <TableCell className="pl-4">
                                                <Checkbox 
                                                    checked={selectedValues.includes(value.id)}
                                                    onCheckedChange={(checked) => toggleSelectValue(value.id, !!checked)}
                                                    aria-label={`Select ${value.name}`}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium text-slate-900 dark:text-slate-100">
                                                {value.name}
                                                {value.description && (
                                                    <p className="text-xs text-slate-500 font-normal truncate max-w-[180px]">{value.description}</p>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div 
                                                    className="inline-flex items-center px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group/code"
                                                    onClick={() => copyToClipboard(`{{company.${value.slug}}}`)}
                                                >
                                                    {`{{company.${value.slug}}}`}
                                                    <Copy className="h-3 w-3 ml-2 opacity-0 group-hover/code:opacity-100 transition-opacity" />
                                                </div>
                                            </TableCell>
                                            <TableCell onClick={() => !editingCellId && startEditingCell(value)} className="cursor-pointer">
                                                {editingCellId === value.id ? (
                                                    <Input 
                                                        value={editingCellValue}
                                                        onChange={(e) => setEditingCellValue(e.target.value)}
                                                        onBlur={saveCellEdit}
                                                        onKeyDown={handleCellKeyDown}
                                                        autoFocus
                                                        className="h-8"
                                                        onClick={(e) => e.stopPropagation()}
                                                    />
                                                ) : (
                                                    <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[300px] block" title={value.value}>
                                                        {value.value}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="font-normal text-slate-500 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                                                    {folders.find(f => f.id === value.folderId)?.name || 'Uncategorized'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => openEditValueDialog(value)}>
                                                            <Pencil className="mr-2 h-4 w-4" /> Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => openMoveToFolderDialog(value)}>
                                                            <Folder className="mr-2 h-4 w-4" /> Move to Folder
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => deleteValue(value.id)}>
                                                            <Trash className="mr-2 h-4 w-4" /> Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
                
                <TabsContent value="folders" className="flex-1 overflow-auto p-6 mt-0">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {/* Folders List */}
                        <div className="space-y-4">
                        {folders.map(folder => (
                            <div key={folder.id} className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                                <div 
                                    className="flex items-center justify-between px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                                    onClick={() => !editingFolderId && toggleFolder(folder.id)}
                                >
                                    <div className="flex items-center gap-2 flex-1">
                                        {editingFolderId === folder.id ? (
                                            <div className="flex items-center gap-2 w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
                                                <Input 
                                                    value={editingFolderName}
                                                    onChange={(e) => setEditingFolderName(e.target.value)}
                                                    className="h-8 text-sm"
                                                    autoFocus
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') saveFolderRename(e);
                                                        if (e.key === 'Escape') cancelEditingFolder(e as any);
                                                    }}
                                                />
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50" onClick={saveFolderRename}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-500 hover:text-slate-700" onClick={cancelEditingFolder}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <>
                                                {expandedFolders.includes(folder.id) ? (
                                                    <ChevronDown className="h-4 w-4 text-slate-500" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-slate-500" />
                                                )}
                                                <Folder className="h-4 w-4 text-indigo-500" />
                                                <span className="font-medium text-sm text-slate-900 dark:text-slate-100">{folder.name}</span>
                                                <Badge variant="secondary" className="ml-2 text-[10px] h-5">
                                                    {groupedValues[folder.id]?.length || 0} values
                                                </Badge>
                                            </>
                                        )}
                                    </div>
                                    {!editingFolderId && (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => startEditingFolder(folder)}>Rename Folder</DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600" onClick={() => setFolderToDelete(folder.id)}>
                                                    Delete Folder
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    )}
                                </div>

                                {expandedFolders.includes(folder.id) && !editingFolderId && (
                                    <div className="border-t border-slate-100 dark:border-slate-800">
                                        {groupedValues[folder.id]?.length > 0 ? (
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                                                        <TableHead className="w-[50px] pl-6">
                                                            <Checkbox 
                                                                checked={groupedValues[folder.id].length > 0 && groupedValues[folder.id].every(f => selectedValues.includes(f.id))}
                                                                onCheckedChange={(checked) => toggleSelectGroup(groupedValues[folder.id], !!checked)}
                                                                aria-label={`Select all in ${folder.name}`}
                                                            />
                                                        </TableHead>
                                                        <TableHead className="w-[20%] text-xs font-medium">Value Name</TableHead>
                                                        <TableHead className="w-[30%] text-xs font-medium">Value</TableHead>
                                                        <TableHead className="w-[20%] text-xs font-medium">Key</TableHead>
                                                        <TableHead className="w-[25%] text-xs font-medium">Description</TableHead>
                                                        <TableHead className="w-[5%] text-xs font-medium"></TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {groupedValues[folder.id].map(value => {
                                                        const isSelected = selectedValues.includes(value.id);
                                                        return (
                                                            <TableRow key={value.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 ${isSelected ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                                                                <TableCell className="pl-6">
                                                                    <Checkbox 
                                                                        checked={isSelected}
                                                                        onCheckedChange={(checked) => toggleSelectValue(value.id, !!checked)}
                                                                        aria-label={`Select ${value.name}`}
                                                                    />
                                                                </TableCell>
                                                                <TableCell className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                                    {value.name}
                                                                </TableCell>
                                                                <TableCell onClick={() => !editingCellId && startEditingCell(value)} className="cursor-pointer">
                                                                    {editingCellId === value.id ? (
                                                                        <Input 
                                                                            value={editingCellValue}
                                                                            onChange={(e) => setEditingCellValue(e.target.value)}
                                                                            onBlur={saveCellEdit}
                                                                            onKeyDown={handleCellKeyDown}
                                                                            autoFocus
                                                                            className="h-8"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        />
                                                                    ) : (
                                                                        <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[300px] block" title={value.value}>
                                                                            {value.value}
                                                                        </span>
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div 
                                                                        className="group flex items-center gap-2 cursor-pointer w-fit"
                                                                        onClick={() => copyToClipboard(`{{company.${value.slug}}}`)}
                                                                    >
                                                                        <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                                                                            {`{{company.${value.slug}}}`}
                                                                        </code>
                                                                        <Copy className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-sm text-slate-500 truncate max-w-[200px]">
                                                                    {value.description || '-'}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem onClick={() => openEditValueDialog(value)}>Edit Value</DropdownMenuItem>
                                                                            <DropdownMenuItem onClick={() => openMoveToFolderDialog(value)}>Move to Folder</DropdownMenuItem>
                                                                            <DropdownMenuSeparator />
                                                                            <DropdownMenuItem className="text-red-600" onClick={() => deleteValue(value.id)}>
                                                                                Delete Value
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                </TableCell>
                                                            </TableRow>
                                                        )})}
                                                </TableBody>
                                            </Table>
                                        ) : (
                                            <div className="py-8 text-center text-sm text-slate-500 italic">
                                                No values in this folder yet.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Uncategorized Values */}
                        {groupedValues.uncategorized?.length > 0 && (
                            <div className="bg-white dark:bg-slate-950 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
                                <div className="px-4 py-3 bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-slate-400" />
                                        <span className="font-medium text-sm text-slate-900 dark:text-slate-100">Uncategorized Values</span>
                                        <Badge variant="secondary" className="ml-2 text-[10px] h-5">
                                            {groupedValues.uncategorized.length} values
                                        </Badge>
                                    </div>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-slate-800">
                                            <TableHead className="w-[50px] pl-6">
                                                <Checkbox 
                                                    checked={groupedValues.uncategorized.length > 0 && groupedValues.uncategorized.every(f => selectedValues.includes(f.id))}
                                                    onCheckedChange={(checked) => toggleSelectGroup(groupedValues.uncategorized, !!checked)}
                                                    aria-label="Select all uncategorized"
                                                />
                                            </TableHead>
                                            <TableHead className="w-[20%] text-xs font-medium">Value Name</TableHead>
                                            <TableHead className="w-[30%] text-xs font-medium">Value</TableHead>
                                            <TableHead className="w-[20%] text-xs font-medium">Key</TableHead>
                                            <TableHead className="w-[25%] text-xs font-medium">Description</TableHead>
                                            <TableHead className="w-[5%] text-xs font-medium"></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {groupedValues.uncategorized.map(value => {
                                            const isSelected = selectedValues.includes(value.id);
                                            return (
                                                <TableRow key={value.id} className={`hover:bg-slate-50/80 dark:hover:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800 ${isSelected ? 'bg-slate-50 dark:bg-slate-900/50' : ''}`}>
                                                    <TableCell className="pl-6">
                                                        <Checkbox 
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => toggleSelectValue(value.id, !!checked)}
                                                            aria-label={`Select ${value.name}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium text-sm text-slate-700 dark:text-slate-300">
                                                        {value.name}
                                                    </TableCell>
                                                    <TableCell onClick={() => !editingCellId && startEditingCell(value)} className="cursor-pointer">
                                                        {editingCellId === value.id ? (
                                                            <Input 
                                                                value={editingCellValue}
                                                                onChange={(e) => setEditingCellValue(e.target.value)}
                                                                onBlur={saveCellEdit}
                                                                onKeyDown={handleCellKeyDown}
                                                                autoFocus
                                                                className="h-8"
                                                                onClick={(e) => e.stopPropagation()}
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-[300px] block" title={value.value}>
                                                                {value.value}
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div 
                                                            className="group flex items-center gap-2 cursor-pointer w-fit"
                                                            onClick={() => copyToClipboard(`{{company.${value.slug}}}`)}
                                                        >
                                                            <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-slate-600 dark:text-slate-400 font-mono">
                                                                {`{{company.${value.slug}}}`}
                                                            </code>
                                                            <Copy className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-slate-500 truncate max-w-[200px]">
                                                        {value.description || '-'}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem onClick={() => openEditValueDialog(value)}>Edit Value</DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => openMoveToFolderDialog(value)}>Move to Folder</DropdownMenuItem>
                                                                <DropdownMenuSeparator />
                                                                <DropdownMenuItem className="text-red-600" onClick={() => deleteValue(value.id)}>
                                                                    Delete Value
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )})}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                        </div>
                    </div>
                </TabsContent>

                {/* Floating Action Bar */}
                {selectedValues.length > 0 && (
                    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-auto min-w-[400px] max-w-[90%] z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
                        <div className="bg-zinc-900 text-white rounded-lg shadow-xl border border-zinc-800 p-2 flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 border-r border-zinc-700">
                                <div className="bg-indigo-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                    {selectedValues.length}
                                </div>
                                <span className="text-sm font-medium">Selected</span>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 hover:bg-zinc-800 rounded-full ml-1 text-zinc-400 hover:text-zinc-200"
                                    onClick={() => setSelectedValues([])}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </div>
                            
                            <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2" onClick={openBulkMoveDialog}>
                                <FolderInput className="h-4 w-4" />
                                Move to Folder
                            </Button>

                            <div className="h-4 w-px bg-zinc-700 mx-1 shrink-0" />

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white hover:bg-zinc-800 h-8 gap-2">
                                        <Trash className="h-4 w-4 text-red-400" />
                                        Delete
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete {selectedValues.length} Values?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete the selected values? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleBulkDelete}>Delete</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                )}
            </DashboardLayout>

            <Dialog open={isMoveToFolderOpen} onOpenChange={setIsMoveToFolderOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Move to Folder</DialogTitle>
                        <DialogDescription>
                            Select a folder to move the selected values to.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label htmlFor="move-folder" className="mb-2 block">Folder</Label>
                        <Select 
                            value={selectedFolderId || "uncategorized"} 
                            onValueChange={(val) => setSelectedFolderId(val === "uncategorized" ? null : val)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Folder" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="uncategorized">Uncategorized</SelectItem>
                                {folders.map(folder => (
                                    <SelectItem key={folder.id} value={folder.id}>{folder.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsMoveToFolderOpen(false)}>Cancel</Button>
                        <Button onClick={handleMoveToFolder}>Move</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Tabs>
    );
}