# Unit 5.2: Basic Package Components

## Folder: `11-basic-components`

## Purpose
Implement all UI components for the Basic package, including the main tool interface, sidebar navigation, header, and page-specific components. These components demonstrate the component patterns and best practices for CRM Toolkit packages.

## Context
- Basic package structure created in Unit 5.1
- Need to implement all the UI components referenced in the package initialization
- Components should receive and use the ToolComponentProps interface
- Must follow the established design system (shadcn/ui)
- Should demonstrate proper navigation context handling
- Components need to be styled and functional

## Definition of Done
- [ ] BasicSidebar component with navigation
- [ ] BasicHeader component with breadcrumbs
- [ ] NoteListPage with create/edit/delete functionality
- [ ] NoteDetailPage with edit form
- [ ] NoteSettingsPage with configuration options
- [ ] Proper TypeScript types for all props
- [ ] Navigation context used correctly
- [ ] Components handle loading and error states
- [ ] Responsive design implemented
- [ ] Integration with workspace context

## Components Overview

1. **BasicSidebar** - Navigation sidebar with page list
2. **BasicHeader** - Header with breadcrumbs and actions
3. **NoteListPage** - List all notes with search and filters
4. **NoteDetailPage** - View/edit individual note
5. **NoteSettingsPage** - Package configuration

## Files to Create

### 1. `/packages/basic/src/components/BasicSidebar.tsx`
```typescript
/**
 * Sidebar component for the Basic tool
 * Provides navigation between different pages
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ToolComponentProps } from "@/types/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Plus, Search, FileText, Settings, ListTodo } from "lucide-react";
import { cn } from "clsx";

interface SidebarNavItem {
  id: string;
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

export function BasicSidebar(props: ToolComponentProps) {
  const { navigation, workspaceId } = props;
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: SidebarNavItem[] = [
    {
      id: "list",
      title: "All Notes",
      href: navigation.navigate(["list"]),
      icon: ListTodo,
    },
    {
      id: "completed",
      title: "Completed",
      href: navigation.navigate(["list"], { completed: "true" }),
      icon: FileText,
      badge: "12", // This would come from actual count
    },
    {
      id: "settings",
      title: "Settings",
      href: navigation.navigate(["settings"]),
      icon: Settings,
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full w-64 flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold mb-3">Basic Notepad</h2>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 p-4">
        <nav className="space-y-2">
          {filteredNavItems.map((item) => {
            const isActive = pathname.endsWith(item.href.split('/').pop());
            return (
              <Link key={item.id} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive && "bg-secondary"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  <span className="flex-1 text-left">{item.title}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2">
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-4" />

        {/* Quick Actions */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground px-1">
            Quick Actions
          </p>
          <Link href={navigation.navigate(["list"], { action: "new" })}>
            <Button variant="outline" className="w-full justify-start">
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </Link>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t">
        <p className="text-xs text-muted-foreground">
          Basic Package v1.0.0
        </p>
      </div>
    </div>
  );
}
```

### 2. `/packages/basic/src/components/BasicHeader.tsx`
```typescript
/**
 * Header component for the Basic tool
 * Displays breadcrumbs and provides actions
 */

"use client";

import { useState } from "react";
import type { ToolComponentProps } from "@/types/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Plus, Search, MoreVertical, FileText, CheckCircle2, Circle } from "lucide-react";
import { cn } from "clsx";

export function BasicHeader(props: ToolComponentProps) {
  const { navigation, workspaceId } = props;
  const [searchQuery, setSearchQuery] = useState("");

  // Determine current page from route
  const currentPage = navigation.currentRoute[0] || "list";
  const noteId = navigation.currentRoute[1];

  const getPageTitle = () => {
    switch (currentPage) {
      case "list":
        return "All Notes";
      case "settings":
        return "Settings";
      case "note":
        return noteId ? "Note Detail" : "New Note";
      default:
        return "Basic Notepad";
    }
  };

  const getBreadcrumbs = () => {
    const crumbs = [
      { label: "Dashboard", href: `/${workspaceId}/dashboard` },
      { label: "Basic", href: navigation.navigate(["list"]) },
    ];

    if (currentPage !== "list") {
      crumbs.push({ label: getPageTitle(), href: "" });
    }

    return crumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const isListPage = currentPage === "list";

  return (
    <div className="flex h-14 items-center px-4 gap-4 border-b">
      {/* Breadcrumbs */}
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {crumb.href ? (
                  <BreadcrumbLink href={crumb.href}>{crumb.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>

      {/* Search - only on list page */}
      {isListPage && (
        <div className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {isListPage && (
          <Button asChild size="sm">
            <Link href={navigation.navigate(["list"], { action: "new" })}>
              <Plus className="mr-2 h-4 w-4" />
              New Note
            </Link>
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <FileText className="mr-2 h-4 w-4" />
              Export Notes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Circle className="mr-2 h-4 w-4" />
              Mark All Incomplete
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Mark All Complete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
```

### 3. `/packages/basic/src/components/NoteList.tsx`
```typescript
/**
 * Note list page component
 * Displays all notes with search and filtering
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ToolComponentProps } from "@/types/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { Plus, Search, FileText, Calendar, CheckCircle2, Circle } from "lucide-react";
import { cn } from "clsx";
import type { Note, NoteFilter } from "~/types";
import { useBasic } from "~/hooks/useBasic";

export function NoteListPage(props: ToolComponentProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useBasic();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCompleted, setShowCompleted] = useState(config.showCompleted);

  // Check if we should show only completed notes
  useEffect(() => {
    const completed = searchParams.get("completed");
    if (completed === "true") {
      setShowCompleted(true);
    } else if (completed === "false") {
      setShowCompleted(false);
    }
  }, [searchParams]);

  // Load notes
  useEffect(() => {
    async function loadNotes() {
      setIsLoading(true);
      try {
        const filter: NoteFilter = {
          search: searchQuery,
          completed: showCompleted,
        };

        // TODO: Replace with actual API call
        const response = await fetch(
          `/api/basic/notes?${new URLSearchParams(filter as any).toString()}`
        );
        const data = await response.json();
        setNotes(data.notes || []);
      } catch (error) {
        console.error("Failed to load notes:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadNotes();
  }, [searchQuery, showCompleted]);

  const handleNoteClick = (noteId: string) => {
    const noteUrl = props.navigation.navigate(["note", noteId]);
    router.push(noteUrl);
  };

  const handleCreateNote = () => {
    const createUrl = props.navigation.navigate(["note", "new"]);
    router.push(createUrl);
  };

  const handleToggleComplete = async (noteId: string, completed: boolean) => {
    try {
      // TODO: Replace with actual API call
      await fetch(`/api/basic/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !completed }),
      });

      // Update local state
      setNotes(prev =>
        prev.map(note =>
          note.id === noteId ? { ...note, completed: !completed } : note
        )
      );
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = !searchQuery ||
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content && note.content.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCompleted = showCompleted || !note.completed;

    return matchesSearch && matchesCompleted;
  });

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notes</h1>
          <p className="text-muted-foreground">
            Manage your notes and todos
          </p>
        </div>
        <Button onClick={handleCreateNote}>
          <Plus className="mr-2 h-4 w-4" />
          New Note
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="show-completed"
            checked={showCompleted}
            onCheckedChange={(checked) => setShowCompleted(checked as boolean)}
          />
          <label
            htmlFor="show-completed"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Show completed
          </label>
        </div>
      </div>

      {/* Notes List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <Card
              key={note.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                note.completed && "opacity-75"
              )}
              onClick={() => handleNoteClick(note.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-1">
                    <CardTitle className={cn(
                      "text-lg",
                      note.completed && "line-through"
                    )}>
                      {note.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(note.id, note.completed);
                    }}
                  >
                    {note.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {note.content || "No content"}
                </p>
                {note.completed && (
                  <Badge variant="secondary" className="mt-2">
                    Completed
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={FileText}
            title="No notes found"
            description={searchQuery ? "Try adjusting your search" : "Create your first note to get started"}
            action={
              <Button onClick={handleCreateNote}>
                <Plus className="mr-2 h-4 w-4" />
                Create Note
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
```

### 4. `/packages/basic/src/components/NoteDetail.tsx`
```typescript
/**
 * Note detail page component
 * Allows viewing and editing individual notes
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ToolComponentProps } from "@/types/registry";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Save, Trash2, Calendar } from "lucide-react";
import { cn } from "clsx";
import type { Note } from "~/types";

export function NoteDetailPage(props: ToolComponentProps) {
  const router = useRouter();
  const noteId = props.navigation.routeParams.id;
  const isNewNote = noteId === "new";

  const [note, setNote] = useState<Partial<Note> | null>(null);
  const [isLoading, setIsLoading] = useState(!isNewNote);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load note if editing
  useEffect(() => {
    if (!isNewNote && noteId) {
      loadNote();
    } else {
      // Initialize new note
      setNote({
        title: "",
        content: "",
        completed: false,
      });
      setIsLoading(false);
    }
  }, [isNewNote, noteId]);

  async function loadNote() {
    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call
      const response = await fetch(`/api/basic/notes/${noteId}`);
      if (!response.ok) {
        throw new Error("Note not found");
      }
      const data = await response.json();
      setNote(data.note);
    } catch (error) {
      console.error("Failed to load note:", error);
      setError("Failed to load note");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave() {
    if (!note?.title?.trim()) {
      setError("Title is required");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const method = isNewNote ? "POST" : "PATCH";
      const url = isNewNote ? "/api/basic/notes" : `/api/basic/notes/${noteId}`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: note.title,
          content: note.content || "",
          completed: note.completed || false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const data = await response.json();

      if (isNewNote) {
        // Navigate to the new note
        router.replace(props.navigation.navigate(["note", data.note.id]));
      } else {
        setNote(data.note);
      }

      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save note:", error);
      setError("Failed to save note");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!note?.id || isNewNote) return;

    if (!confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      // TODO: Replace with actual API call
      await fetch(`/api/basic/notes/${note.id}`, {
        method: "DELETE",
      });

      router.push(props.navigation.navigate(["list"]));
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note");
    }
  }

  function handleBack() {
    if (hasChanges && !confirm("You have unsaved changes. Are you sure you want to leave?")) {
      return;
    }
    router.push(props.navigation.navigate(["list"]));
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold flex-1">
          {isNewNote ? "New Note" : "Edit Note"}
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
          {!isNewNote && (
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Note Details</CardTitle>
          <CardDescription>
            {isNewNote
              ? "Create a new note"
              : "Edit your note"
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title *
            </label>
            <Input
              id="title"
              value={note?.title || ""}
              onChange={(e) => {
                setNote(prev => prev ? { ...prev, title: e.target.value } : null);
                setHasChanges(true);
              }}
              placeholder="Enter note title..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content
            </label>
            <Textarea
              id="content"
              value={note?.content || ""}
              onChange={(e) => {
                setNote(prev => prev ? { ...prev, content: e.target.value } : null);
                setHasChanges(true);
              }}
              placeholder="Enter note content..."
              rows={10}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="completed"
              checked={note?.completed || false}
              onCheckedChange={(checked) => {
                setNote(prev => prev ? { ...prev, completed: checked as boolean } : null);
                setHasChanges(true);
              }}
            />
            <label
              htmlFor="completed"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Mark as completed
            </label>
          </div>

          {note?.createdAt && (
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-3 w-3" />
              Created on {new Date(note.createdAt).toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

### 5. `/packages/basic/src/components/NoteSettings.tsx`
```typescript
/**
 * Settings page component for the Basic package
 * Allows users to configure package behavior
 */

"use client";

import { useState } from "react";
import type { ToolComponentProps } from "@/types/registry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Save, RotateCcw } from "lucide-react";
import { useBasic } from "~/hooks/useBasic";
import type { BasicPackageConfig } from "~/types";

export function NoteSettingsPage(props: ToolComponentProps) {
  const { config: currentConfig, updateConfig } = useBasic();
  const [config, setConfig] = useState<BasicPackageConfig>(currentConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  function handleConfigChange<K extends keyof BasicPackageConfig>(
    key: K,
    value: BasicPackageConfig[K]
  ) {
    setConfig(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      // TODO: Save to user preferences
      updateConfig(config);
      setHasChanges(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    } finally {
      setIsSaving(false);
    }
  }

  function handleReset() {
    setConfig(currentConfig);
    setHasChanges(false);
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Configure your Basic Notepad preferences
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={!hasChanges}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Display Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Display</CardTitle>
            <CardDescription>
              Customize how your notes are displayed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="default-view">Default View</Label>
              <Select
                value={config.defaultView}
                onValueChange={(value: "list" | "grid") =>
                  handleConfigChange("defaultView", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="list">List View</SelectItem>
                  <SelectItem value="grid">Grid View</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Show Completed Notes</Label>
                <p className="text-sm text-muted-foreground">
                  Display completed notes in the main list
                </p>
              </div>
              <Switch
                checked={config.showCompleted}
                onCheckedChange={(checked) =>
                  handleConfigChange("showCompleted", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Behavior Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Behavior</CardTitle>
            <CardDescription>
              Configure how the notepad behaves
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-save</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically save notes as you type
                </p>
              </div>
              <Switch
                checked={config.autoSave}
                onCheckedChange={(checked) =>
                  handleConfigChange("autoSave", checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Info Section */}
      <Card>
        <CardHeader>
          <CardTitle>About Basic Package</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <dt className="font-medium">Version</dt>
              <dd>1.0.0</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Author</dt>
              <dd>CRM Toolkit Team</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Features</dt>
              <dd>Note management, TODO tracking, Search</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
```

## Validation Checklist

- [ ] BasicSidebar renders with navigation items
- [ ] BasicHeader shows correct breadcrumbs
- [ ] NoteListPage loads and displays notes
- [ ] NoteDetailPage allows creating/editing notes
- [ ] NoteSettingsPage saves configuration
- [ ] All components receive ToolComponentProps correctly
- [ ] Navigation context is used properly
- [ ] Loading states display correctly
- [ ] Error handling is implemented
- [ ] Responsive design works on mobile

## Testing the Components

1. Navigate to `/[workspace]/tools/basic`
2. Test sidebar navigation
3. Create a new note
4. Edit an existing note
5. Mark notes as complete
6. Search and filter notes
7. Configure settings

## Next Steps

After implementing the components:
1. Add database features (Unit 5.3)
2. Implement server-side features (Unit 5.4)
3. Test full integration (Unit 6.1)