
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/Layout";
import { 
  Folder, 
  File, 
  MoreHorizontal, 
  Grid, 
  List, 
  Columns, 
  Search, 
  Plus,
  Upload,
  ChevronRight,
  Home,
  Image as ImageIcon,
  FileText,
  Copy,
  Trash,
  Move,
  Info,
  ExternalLink,
  Scissors,
  Check,
  Star,
  PanelRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
  ContextMenuShortcut,
  ContextMenuCheckboxItem,
} from "@/components/ui/context-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DndContext, DragOverlay, useDraggable, useDroppable, closestCenter, pointerWithin, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMedia, FileSystemItem } from "@/context/media-context";

export default function MediaPage() {
  const { 
    items, 
    setItems, 
    currentPath, 
    setCurrentPath, 
    selectedItems, 
    setSelectedItems, 
    viewMode, 
    setViewMode, 
    navigateToFolder, 
    navigateUp,
    favoriteItems,
    toggleFavorite,
    isPreviewVisible,
    togglePreview
  } = useMedia();

  const [draggedItem, setDraggedItem] = useState<FileSystemItem | null>(null);

  // Configure sensors for better click/drag distinction
  // Require a hold of 200ms to start dragging, allowing clicks to pass through immediately if released earlier
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  const currentFolderId = currentPath.length > 0 ? currentPath[currentPath.length - 1].id : null;
  const currentItems = items.filter(item => item.parentId === currentFolderId);

  const handleDragStart = (event: any) => {
    const item = items.find(i => i.id === event.active.id);
    if (item) setDraggedItem(item);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const activeItem = items.find(i => i.id === active.id);
      const overItem = items.find(i => i.id === over.id);
      
      if (activeItem && overItem && overItem.type === 'folder') {
        // Move item logic
        setItems(items.map(i => {
          if (i.id === activeItem.id) {
            return { ...i, parentId: overItem.id };
          }
          return i;
        }));
      }
    }
    setDraggedItem(null);
  };

  const DraggableItem = React.forwardRef<HTMLDivElement, { item: FileSystemItem, children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>>(
    ({ item, children, className, ...props }, ref) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
      id: item.id,
      data: item
    });

    const setRef = (element: HTMLDivElement | null) => {
      setNodeRef(element);
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = element;
      }
    };

    return (
      <div 
        ref={setRef} 
        {...listeners} 
        {...attributes} 
        {...props}
        className={`${className || ''} ${isDragging ? 'opacity-50' : ''}`}
      >
        {children}
      </div>
    );
  });
  DraggableItem.displayName = "DraggableItem";

  const DroppableFolder = ({ item, children }: { item: FileSystemItem, children: React.ReactNode }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: item.id,
      data: item
    });

    return (
      <div 
        ref={setNodeRef}
        className={`${isOver ? 'bg-primary/10 ring-2 ring-primary ring-inset rounded-lg' : ''}`}
      >
        {children}
      </div>
    );
  };

  const handleSelection = (item: FileSystemItem, event: React.MouseEvent, contextItems?: FileSystemItem[]) => {
    event.stopPropagation();
    
    // Use provided context items or default to currentItems (for grid/list view)
    const effectiveItems = contextItems || currentItems;
    
    if (event.ctrlKey || event.metaKey) {
      // Toggle selection
      setSelectedItems(prev => 
        prev.includes(item.id) 
          ? prev.filter(id => id !== item.id) 
          : [...prev, item.id]
      );
    } else if (event.shiftKey && selectedItems.length > 0) {
      // Range selection
      const lastSelectedId = selectedItems[selectedItems.length - 1];
      const currentIndex = effectiveItems.findIndex(i => i.id === item.id);
      const lastIndex = effectiveItems.findIndex(i => i.id === lastSelectedId);
      
      if (currentIndex !== -1 && lastIndex !== -1) {
        const start = Math.min(currentIndex, lastIndex);
        const end = Math.max(currentIndex, lastIndex);
        const range = effectiveItems.slice(start, end + 1).map(i => i.id);
        
        // Add range to existing selection (union)
        setSelectedItems(prev => Array.from(new Set([...prev, ...range])));
      } else {
        setSelectedItems([item.id]);
      }
    } else {
      // Single selection (exclusive)
      setSelectedItems([item.id]);
    }
  };

  const ContextMenuWrapper = ({ item, children }: { item: FileSystemItem, children: React.ReactNode }) => {
    return (
      <ContextMenu>
        <ContextMenuTrigger asChild onContextMenu={(e) => {
            // If item is not in selection, select it exclusively
            if (!selectedItems.includes(item.id)) {
                setSelectedItems([item.id]);
            }
        }}>
            {children}
        </ContextMenuTrigger>
        <ContextMenuContent className="w-64">
          {selectedItems.length > 1 ? (
              <>
                 <DropdownMenuLabel className="truncate max-w-[200px]">
                    Selected {selectedItems.length} items
                 </DropdownMenuLabel>
                 <ContextMenuSeparator />
                 <ContextMenuItem inset>
                    <Download className="mr-2 h-4 w-4" /> Download {selectedItems.length} Items
                 </ContextMenuItem>
                 <ContextMenuItem inset>
                    <Copy className="mr-2 h-4 w-4" /> Copy {selectedItems.length} Items
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                 </ContextMenuItem>
                 <ContextMenuItem inset>
                    <Scissors className="mr-2 h-4 w-4" /> Cut {selectedItems.length} Items
                    <ContextMenuShortcut>⌘X</ContextMenuShortcut>
                 </ContextMenuItem>
                 <ContextMenuItem inset>
                    <Move className="mr-2 h-4 w-4" /> Move to...
                 </ContextMenuItem>
                 <ContextMenuSeparator />
                 <ContextMenuItem inset className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" /> Delete {selectedItems.length} Items
                    <ContextMenuShortcut>⌫</ContextMenuShortcut>
                 </ContextMenuItem>
              </>
          ) : (
              <>
                <DropdownMenuLabel className="truncate max-w-[200px]">{item.name}</DropdownMenuLabel>
                <ContextMenuSeparator />
                <ContextMenuItem inset>
                    <ExternalLink className="mr-2 h-4 w-4" /> Open
                </ContextMenuItem>
                <ContextMenuItem inset>
                    <Download className="mr-2 h-4 w-4" /> Download
                </ContextMenuItem>
                <ContextMenuItem inset>
                    <Info className="mr-2 h-4 w-4" /> Get Info
                </ContextMenuItem>
                {item.type === 'folder' && (
                    <ContextMenuItem inset onClick={() => toggleFavorite(item.id)}>
                        <Star className={`mr-2 h-4 w-4 ${favoriteItems.includes(item.id) ? "fill-yellow-500 text-yellow-500" : ""}`} /> 
                        {favoriteItems.includes(item.id) ? "Remove from Favorites" : "Pin to Favorites"}
                    </ContextMenuItem>
                )}
                <ContextMenuSeparator />
                <ContextMenuItem inset>
                    <Copy className="mr-2 h-4 w-4" /> Copy
                    <ContextMenuShortcut>⌘C</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset>
                    <Scissors className="mr-2 h-4 w-4" /> Cut
                    <ContextMenuShortcut>⌘X</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem inset>
                    <Move className="mr-2 h-4 w-4" /> Move to...
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem inset className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                    <ContextMenuShortcut>⌫</ContextMenuShortcut>
                </ContextMenuItem>
              </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    );
  };

  const FilePreview = ({ selectedItem }: { selectedItem: FileSystemItem | undefined }) => {
    if (!selectedItem) return (
      <div className="text-slate-400 flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
          <Columns className="h-8 w-8 opacity-50" />
        </div>
        <p>Select an item to view details</p>
      </div>
    );

    return (
      <div className="space-y-6 w-full max-w-sm animate-in fade-in zoom-in-95 duration-200">
        <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center relative group">
          {selectedItem.url ? (
            <img src={selectedItem.url} className="w-full h-full object-cover" />
          ) : (
            <div className="p-12">
              {selectedItem.type === 'folder' ? (
                <Folder className="h-24 w-24 text-blue-500/50" />
              ) : (
                <FileText className="h-24 w-24 text-slate-300" />
              )}
            </div>
          )}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{selectedItem.name}</h3>
          <div className="flex items-center justify-center gap-4 text-sm text-slate-500">
            <span>{selectedItem.size || 'Folder'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{selectedItem.modified}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button variant="outline" className="w-full">Open</Button>
          <Button className="w-full">Download</Button>
        </div>
      </div>
    );
  };

  // Render content based on view mode
  const renderContent = () => {
    if (viewMode === 'list') {
      return (
        <div className="border rounded-lg overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium w-[40%]">Name</th>
                <th className="px-4 py-3 text-left font-medium">Date Modified</th>
                <th className="px-4 py-3 text-left font-medium">Size</th>
                <th className="px-4 py-3 text-left font-medium">Kind</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {currentItems.map(item => (
                <ContextMenuWrapper key={item.id} item={item}>
                  <tr 
                    className={`group cursor-pointer transition-colors ${selectedItems.includes(item.id) ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                    onClick={(e) => handleSelection(item, e)}
                    onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (item.type === 'folder') navigateToFolder(item);
                    }}
                  >
                    <td className="px-4 py-2">
                      <DraggableItem item={item}>
                        <div className="flex items-center gap-3">
                          {item.type === 'folder' ? (
                            <DroppableFolder item={item}>
                              <Folder className="h-5 w-5 text-blue-500 fill-blue-500/20" />
                            </DroppableFolder>
                          ) : item.type === 'image' ? (
                            <div className="h-8 w-8 rounded overflow-hidden bg-slate-100 border border-slate-200">
                                {item.url ? <img src={item.url} className="h-full w-full object-cover" /> : <ImageIcon className="h-5 w-5 m-1.5 text-purple-500" />}
                            </div>
                          ) : (
                            <FileText className="h-5 w-5 text-slate-400" />
                          )}
                          <span className="font-medium text-slate-700 dark:text-slate-200">{item.name}</span>
                        </div>
                      </DraggableItem>
                    </td>
                    <td className="px-4 py-2 text-slate-500">{item.modified}</td>
                    <td className="px-4 py-2 text-slate-500">{item.size || '--'}</td>
                    <td className="px-4 py-2 text-slate-500 capitalize">{item.type}</td>
                  </tr>
                </ContextMenuWrapper>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-12 text-center text-slate-400">
                    This folder is empty
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      );
    }

    if (viewMode === 'columns') {
      // For columns view, we need to show the full path hierarchy in columns
      // Start with root, then subsequent path items
      const columns = [
        { id: 'root', items: items.filter(i => i.parentId === null) },
        ...currentPath.map(folder => ({
          id: folder.id,
          items: items.filter(i => i.parentId === folder.id)
        }))
      ];

      return (
        <div className="flex h-full overflow-x-auto border rounded-lg bg-white dark:bg-slate-900 shadow-sm divide-x divide-slate-200 dark:divide-slate-800">
          {columns.map((column, index) => (
            <div key={column.id} className="min-w-[250px] w-[250px] flex-shrink-0 flex flex-col h-full bg-slate-50/30 dark:bg-slate-900/30">
              <ScrollArea className="h-full">
                <div className="p-2 space-y-0.5">
                  {column.items.map(item => {
                    const isSelected = currentPath[index] && currentPath[index].id === item.id;
                    const isLeafSelected = selectedItems.includes(item.id);
                    
                    return (
                      <ContextMenuWrapper key={item.id} item={item}>
                        <DraggableItem item={item}>
                           <div
                            className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer text-sm ${
                              isLeafSelected
                                ? 'bg-blue-500 text-white' 
                                : isSelected
                                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                            }`}
                            onClick={(e) => {
                              // Always truncate path to current level first (closing any child columns) when interacting with this column
                              const ancestors = currentPath.slice(0, index);

                              if (item.type === 'folder' && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
                                  // Navigate into folder
                                  const newPath = [...ancestors, item];
                                  setCurrentPath(newPath);
                                  setSelectedItems([item.id]);
                              } else {
                                  // Selecting file(s) or modifying selection
                                  setCurrentPath(ancestors);
                                  handleSelection(item, e, column.items);
                              }
                            }}
                          >
                            <div className="flex items-center gap-2 truncate">
                              {item.type === 'folder' ? (
                                <DroppableFolder item={item}>
                                  <Folder className={`h-4 w-4 ${isLeafSelected ? 'text-white fill-white/20' : isSelected ? 'text-slate-500 fill-slate-500/20' : 'text-blue-500 fill-blue-500/20'}`} />
                                </DroppableFolder>
                              ) : item.type === 'image' ? (
                                <ImageIcon className={`h-4 w-4 ${isLeafSelected ? 'text-white' : 'text-purple-500'}`} />
                              ) : (
                                <FileText className={`h-4 w-4 ${isLeafSelected ? 'text-white' : 'text-slate-400'}`} />
                              )}
                              <span className="truncate">{item.name}</span>
                            </div>
                            {item.type === 'folder' && (
                              <ChevronRight className={`h-3.5 w-3.5 ${isLeafSelected ? 'text-white/70' : isSelected ? 'text-slate-500' : 'text-slate-400'}`} />
                            )}
                          </div>
                        </DraggableItem>
                      </ContextMenuWrapper>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          ))}
          {/* Preview Column */}
          {isPreviewVisible && (
           <div className="min-w-[300px] flex-1 bg-white dark:bg-slate-950 p-6 flex flex-col items-center justify-center text-center border-l border-slate-200 dark:border-slate-800 transition-all duration-300">
              {selectedItems.length > 0 ? (
                  <FilePreview selectedItem={items.find(i => i.id === selectedItems[0])} />
              ) : (
                  <div className="text-slate-400 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                          <Columns className="h-8 w-8 opacity-50" />
                      </div>
                      <p>Select an item to view details</p>
                  </div>
              )}
          </div>
          )}
        </div>
      );
    }

    // Default Grid View
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {currentItems.map(item => (
          <ContextMenuWrapper key={item.id} item={item}>
            <DraggableItem item={item}>
              <div 
                className={`group relative flex flex-col gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer hover:shadow-md ${
                  selectedItems.includes(item.id)
                    ? 'bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30 ring-1 ring-primary/20 dark:ring-primary/30'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/20 dark:hover:border-primary/30'
                }`}
                onClick={(e) => handleSelection(item, e)}
                onDoubleClick={(e) => {
                   e.stopPropagation();
                   if (item.type === 'folder') navigateToFolder(item);
                }}
              >
                <div className="aspect-square w-full rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-950 flex items-center justify-center relative">
                  {item.type === 'folder' ? (
                    <DroppableFolder item={item}>
                      <Folder className="h-12 w-12 text-primary fill-primary/20 transition-transform group-hover:scale-110 duration-300" />
                    </DroppableFolder>
                  ) : item.type === 'image' ? (
                    item.url ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                    ) : (
                      <ImageIcon className="h-10 w-10 text-primary" />
                    )
                  ) : (
                    <FileText className="h-10 w-10 text-slate-400 group-hover:text-primary transition-colors" />
                  )}
                  
                  {/* Selection Checkbox (visible on hover or selected) */}
                  <div className={`absolute top-2 right-2 h-5 w-5 rounded-full border flex items-center justify-center transition-opacity ${
                      selectedItems.includes(item.id) 
                        ? 'opacity-100 border-primary bg-primary text-primary-foreground' 
                        : 'opacity-0 group-hover:opacity-100 border-slate-200 bg-white text-transparent'
                  }`}>
                    {selectedItems.includes(item.id) ? (
                        <Check className="h-3 w-3" />
                    ) : (
                        <div className="h-2 w-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                </div>
                
                <div className="space-y-0.5">
                  <p className={`text-sm font-medium truncate ${selectedItems.includes(item.id) ? 'text-primary' : 'text-slate-700 dark:text-slate-200'}`} title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {item.size || (item.items ? `${item.items.length} items` : '')}
                  </p>
                </div>
              </div>
            </DraggableItem>
          </ContextMenuWrapper>
        ))}
        
        {/* Empty State for Grid */}
        {currentItems.length === 0 && (
            <div className="col-span-full py-16 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                    <Upload className="h-6 w-6 text-slate-400" />
                </div>
                <p className="font-medium">Drag files here to upload</p>
                <p className="text-sm mt-1">or click "Upload" button</p>
            </div>
        )}
      </div>
    );
  };

  const CustomHeader = () => (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200/60 dark:border-slate-800 bg-white/50 backdrop-blur-sm px-8 py-4 transition-all duration-300">
      <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 shrink-0 text-slate-500 hover:text-slate-700" 
            disabled={currentPath.length === 0}
            onClick={navigateUp}
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
          </Button>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1 shrink-0" />
          
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-slate-500 whitespace-nowrap px-1">
            <span 
                className="cursor-pointer hover:text-primary transition-colors flex items-center gap-1 font-medium"
                onClick={() => setCurrentPath([])}
            >
                <Home className="h-3.5 w-3.5" />
            </span>
            {currentPath.map((folder, index) => (
                <div key={folder.id} className="flex items-center">
                    <ChevronRight className="h-4 w-4 mx-1 opacity-50" />
                    <span 
                        className={`cursor-pointer hover:text-primary transition-colors ${index === currentPath.length - 1 ? 'font-medium text-slate-900 dark:text-slate-100' : ''}`}
                        onClick={() => {
                            setCurrentPath(currentPath.slice(0, index + 1));
                        }}
                    >
                        {folder.name}
                    </span>
                </div>
            ))}
          </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto">
        {/* View Toggles */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 shrink-0">
            <Button 
                variant="ghost" 
                size="icon" 
                className={`h-7 w-7 rounded-md ${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                onClick={() => setViewMode('grid')}
            >
                <Grid className="h-4 w-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="icon" 
                className={`h-7 w-7 rounded-md ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                onClick={() => setViewMode('list')}
            >
                <List className="h-4 w-4" />
            </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className={`h-7 w-7 rounded-md ${viewMode === 'columns' ? 'bg-white dark:bg-slate-700 shadow-sm text-primary' : 'text-slate-500'}`}
                onClick={() => setViewMode('columns')}
            >
                <Columns className="h-4 w-4" />
            </Button>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />

        <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 text-slate-500 hover:text-slate-700 ${isPreviewVisible ? 'bg-slate-100 dark:bg-slate-800 text-primary' : ''}`}
            onClick={togglePreview}
            title="Toggle Preview Pane"
        >
            <PanelRight className="h-4 w-4" />
        </Button>
        
        <div className="relative hidden sm:block">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search files..." className="pl-9 h-9 w-[200px] bg-white dark:bg-slate-900" />
        </div>
        
        <Button className="h-9 gap-2 shadow-md shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Folder</span>
        </Button>
        <Button variant="outline" className="h-9 gap-2">
            <Upload className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
        </Button>
      </div>
    </div>
  );

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={pointerWithin} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
    >
      <DashboardLayout activeTool="media" header={<CustomHeader />}>
        <div className="flex h-full gap-6">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-4 min-w-0 h-full">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pr-2">
               {renderContent()}
            </div>
          </div>
          
          {/* Global Preview Sidebar for Grid/List */}
          {(viewMode !== 'columns' && isPreviewVisible) && (
             <div className="w-[300px] flex-shrink-0 bg-white dark:bg-slate-950 p-6 flex flex-col items-center justify-start text-center border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
                  <div className="sticky top-0 w-full flex flex-col items-center">
                     {selectedItems.length > 0 ? (
                        <FilePreview selectedItem={items.find(i => i.id === selectedItems[0])} />
                     ) : (
                        <div className="text-slate-400 flex flex-col items-center gap-3 pt-20">
                            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                                <Columns className="h-8 w-8 opacity-50" />
                            </div>
                            <p>Select an item to view details</p>
                        </div>
                     )}
                  </div>
             </div>
          )}
        </div>
      </DashboardLayout>
      <DragOverlay dropAnimation={null}>
            {draggedItem ? (
                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg shadow-xl border border-blue-500 opacity-90 flex items-center gap-2 w-48 pointer-events-none">
                    {draggedItem.type === 'folder' ? <Folder className="h-5 w-5 text-blue-500" /> : <FileText className="h-5 w-5 text-slate-500" />}
                    <span className="truncate font-medium text-sm">{draggedItem.name}</span>
                </div>
            ) : null}
      </DragOverlay>
    </DndContext>
  );
}
