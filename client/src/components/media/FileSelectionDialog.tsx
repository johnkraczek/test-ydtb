import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMedia, FileSystemItem } from "@/context/media-context";
import { Folder, File, ChevronRight, ChevronDown, Check, Home, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileSelectionDialogProps {
  trigger?: React.ReactNode;
  onSelect?: (file: FileSystemItem) => void;
  onCancel?: () => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function FileSelectionDialog({ trigger, onSelect, onCancel, open: controlledOpen, onOpenChange }: FileSelectionDialogProps) {
  const { items } = useMedia();
  const [internalOpen, setInternalOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);

  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };

  const handleToggleFolder = (folderId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setExpandedFolders(prev => 
      prev.includes(folderId) 
        ? prev.filter(id => id !== folderId) 
        : [...prev, folderId]
    );
  };

  const handleFolderClick = (folderId: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setActiveFolderId(folderId);
    // Also expand if not expanded
    if (!expandedFolders.includes(folderId)) {
        handleToggleFolder(folderId);
    }
  };

  const handleSelectFile = (file: FileSystemItem) => {
    if (file.type !== 'folder') {
      setSelectedFileId(file.id);
    }
  };

  const handleConfirm = () => {
    if (selectedFileId) {
      const file = items.find(i => i.id === selectedFileId);
      if (file && onSelect) {
        onSelect(file);
      }
      setOpen(false);
    }
  };

  const handleCancelClick = () => {
    setOpen(false);
    if (onCancel) onCancel();
  };

  const getBreadcrumbs = () => {
    const breadcrumbs: FileSystemItem[] = [];
    let currentId = activeFolderId;
    
    // Safety check to prevent infinite loops if there are circular references (though unlikely in this tree)
    let depth = 0;
    const maxDepth = 20;

    while (currentId && depth < maxDepth) {
      const folder = items.find(i => i.id === currentId);
      if (folder) {
        breadcrumbs.unshift(folder);
        currentId = folder.parentId;
      } else {
        break;
      }
      depth++;
    }
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const activeFolder = activeFolderId ? items.find(i => i.id === activeFolderId) : null;

  const FileTreeItem = ({ item, level = 0 }: { item: FileSystemItem, level?: number }) => {
    const hasChildren = items.some(i => i.parentId === item.id);
    const isExpanded = expandedFolders.includes(item.id);
    const isSelected = selectedFileId === item.id;
    const isActiveFolder = activeFolderId === item.id;
    
    return (
      <div className="select-none">
        <div 
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm",
            isSelected 
              ? "bg-primary/10 text-primary font-medium" 
              : isActiveFolder && item.type === 'folder'
                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium"
                : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
            item.type === 'folder' ? "font-medium" : ""
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={(e) => item.type === 'folder' ? handleFolderClick(item.id, e) : handleSelectFile(item)}
        >
          {item.type === 'folder' && (
            <div 
              className="p-0.5 rounded-sm hover:bg-slate-200 dark:hover:bg-slate-700 mr-1 transition-colors"
              onClick={(e) => handleToggleFolder(item.id, e)}
            >
              {isExpanded ? <ChevronDown className="h-3 w-3 text-slate-400" /> : <ChevronRight className="h-3 w-3 text-slate-400" />}
            </div>
          )}
          
          {item.type === 'folder' ? (
            <Folder className={cn("h-4 w-4", isActiveFolder ? "fill-blue-500/20 text-blue-600" : "text-blue-500/80")} />
          ) : (
            <File className={cn("h-4 w-4", isSelected ? "text-primary" : "text-slate-400")} />
          )}
          
          <span className="truncate flex-1">{item.name}</span>
          
          {isSelected && <Check className="h-3.5 w-3.5 text-primary ml-auto" />}
        </div>
        
        {hasChildren && isExpanded && (
          <div>
            {items
              .filter(i => i.parentId === item.id)
              .sort((a, b) => {
                // Folders first, then files
                if (a.type === 'folder' && b.type !== 'folder') return -1;
                if (a.type !== 'folder' && b.type === 'folder') return 1;
                return a.name.localeCompare(b.name);
              })
              .map(child => (
                <FileTreeItem key={child.id} item={child} level={level + 1} />
              ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select a file</DialogTitle>
        </DialogHeader>
        
        <div className="border border-slate-200 dark:border-slate-800 rounded-md bg-white dark:bg-slate-950 h-[300px] overflow-hidden mt-2">
          <ScrollArea className="h-full">
            <div className="p-2 space-y-0.5">
               {items.filter(i => i.parentId === null).map(item => (
                  <FileTreeItem key={item.id} item={item} />
               ))}
            </div>
          </ScrollArea>
        </div>

        {/* Breadcrumbs and Dropzone Area */}
        <div className="mt-4 space-y-3">
            <div className="flex items-center gap-1.5 text-sm text-slate-500 px-1 overflow-hidden">
                <div 
                    className={cn(
                        "flex items-center hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800",
                        activeFolderId === null && "text-slate-900 dark:text-slate-100 font-medium bg-slate-100 dark:bg-slate-800"
                    )}
                    onClick={() => setActiveFolderId(null)}
                    title="Home"
                >
                    <Home className="h-4 w-4" />
                </div>
                {breadcrumbs.map((folder) => (
                    <React.Fragment key={folder.id}>
                        <ChevronRight className="h-3 w-3 flex-shrink-0 text-slate-400" />
                        <span 
                            className={cn(
                                "hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors truncate max-w-[100px]",
                                activeFolderId === folder.id && "text-slate-900 dark:text-slate-100 font-medium"
                            )}
                            onClick={() => setActiveFolderId(folder.id)}
                            title={folder.name}
                        >
                            {folder.name}
                        </span>
                    </React.Fragment>
                ))}
            </div>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-lg p-4 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    Upload to {activeFolder?.name || 'Home'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                    Drag and drop or click to upload
                </p>
            </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancelClick}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedFileId}>Select</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
