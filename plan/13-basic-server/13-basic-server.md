# Unit 5.4: Basic Package Server Features

## Folder: `13-basic-server`

## Purpose
Implement server-side features for the Basic package, including server actions for React Server Components, API routes for external access, event handlers for real-time updates, command palette integration, and search provider functionality.

## Context
- Database features implemented in Unit 5.3
- Need server-side endpoints to support UI components
- Must implement React Server Components patterns
- Should provide REST API for external integrations
- Need to integrate with command palette
- Should provide search functionality
- Must handle workspace authentication and permissions
- Should demonstrate event-driven architecture

## Server Features Overview

1. **Server Actions** - For RSC and form submissions
2. **API Routes** - REST endpoints for external access
3. **Event Handlers** - React to registry and system events
4. **Commands** - Command palette integration
5. **Search Provider** - Global search integration
6. **Webhooks** - For external integrations

## Definition of Done
- [ ] Server actions implemented for all CRUD operations
- [ ] API routes working with proper authentication
- [ ] Event handlers set up for real-time updates
- [ ] Commands registered in command palette
- [ ] Search provider working with global search
- [ ] Webhook endpoints created for integrations
- [ ] Proper error handling and validation
- [ ] Rate limiting and security measures
- [ ] Documentation for all endpoints

## Files to Create

### 1. `/packages/basic/src/server/actions.ts`
```typescript
/**
 * Server actions for the Basic package
 * Used by React Server Components and forms
 */

"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@ydtb/core/lib/auth";
import { basicService } from "~/services/BasicService";
import { insertNoteSchema, updateNoteSchema } from "~/db/schema";
import type { CreateNoteInput, UpdateNoteInput } from "~/types";
import { z } from "zod";

/**
 * Get the current user and workspace from session
 */
async function getAuthContext() {
  const session = await auth();
  if (!session?.user?.workspaceId) {
    throw new Error("Unauthorized: No workspace found");
  }
  return {
    userId: session.user.id,
    workspaceId: session.user.workspaceId,
  };
}

/**
 * Create a new note
 */
export async function createNote(data: CreateNoteInput) {
  const { workspaceId } = await getAuthContext();

  // Validate input
  const validatedData = insertNoteSchema.parse(data);

  // Create note
  const note = await basicService.createNote(workspaceId, validatedData);

  // Revalidate cache
  revalidatePath(`/tools/basic`);

  return { success: true, note };
}

/**
 * Get a note by ID
 */
export async function getNote(noteId: string) {
  const { workspaceId } = await getAuthContext();

  const note = await basicService.getNote(workspaceId, noteId);
  if (!note) {
    throw new Error("Note not found");
  }

  return { success: true, note };
}

/**
 * List notes with filters
 */
export async function listNotes(filter?: {
  search?: string;
  completed?: boolean;
  limit?: number;
  offset?: number;
}) {
  const { workspaceId } = await getAuthContext();

  const result = await basicService.listNotes(workspaceId, filter);
  return { success: true, ...result };
}

/**
 * Update a note
 */
export async function updateNote(noteId: string, data: UpdateNoteInput) {
  const { workspaceId } = await getAuthContext();

  // Validate input
  const validatedData = updateNoteSchema.parse(data);

  const note = await basicService.updateNote(workspaceId, noteId, validatedData);

  // Revalidate cache
  revalidatePath(`/tools/basic`);
  revalidatePath(`/tools/basic/note/${noteId}`);

  return { success: true, note };
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string) {
  const { workspaceId } = await getAuthContext();

  await basicService.deleteNote(workspaceId, noteId);

  // Revalidate cache
  revalidatePath(`/tools/basic`);

  return { success: true };
}

/**
 * Toggle note completion
 */
export async function toggleNoteComplete(noteId: string) {
  const { workspaceId } = await getAuthContext();

  const note = await basicService.toggleNoteComplete(workspaceId, noteId);

  // Revalidate cache
  revalidatePath(`/tools/basic`);

  return { success: true, note };
}

/**
 * Get workspace statistics
 */
export async function getWorkspaceStats() {
  const { workspaceId } = await getAuthContext();

  const stats = await basicService.getStats(workspaceId);
  return { success: true, stats };
}

/**
 * Bulk update notes
 */
export async function bulkUpdateNotes(
  noteIds: string[],
  data: UpdateNoteInput
) {
  const { workspaceId } = await getAuthContext();

  // Validate input
  const validatedData = updateNoteSchema.parse(data);

  const results = await Promise.allSettled(
    noteIds.map(id => basicService.updateNote(workspaceId, id, validatedData))
  );

  const successCount = results.filter(r => r.status === "fulfilled").length;

  // Revalidate cache
  revalidatePath(`/tools/basic`);

  return {
    success: true,
    total: noteIds.length,
    successCount,
    failureCount: noteIds.length - successCount,
  };
}

/**
 * Search notes
 */
export async function searchNotes(query: string, options?: {
  limit?: number;
  includeContent?: boolean;
}) {
  const { workspaceId } = await getAuthContext();

  const notes = await basicService.searchNotes(workspaceId, query, options);
  return { success: true, notes };
}
```

### 2. `/packages/basic/src/server/api/notes/route.ts`
```typescript
/**
 * API route for notes operations
 * Handles GET (list), POST (create)
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@ydtb/core/lib/auth";
import { basicService } from "~/services/BasicService";
import { insertNoteSchema } from "~/db/schema";
import { fromZodError } from "zod-validation-error";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filter = {
      search: searchParams.get("search") || undefined,
      completed: searchParams.get("completed")
        ? searchParams.get("completed") === "true"
        : undefined,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!)
        : undefined,
      offset: searchParams.get("offset")
        ? parseInt(searchParams.get("offset")!)
        : undefined,
    };

    const result = await basicService.listNotes(session.user.workspaceId, filter);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Failed to list notes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    try {
      const validatedData = insertNoteSchema.parse(body);
      const note = await basicService.createNote(
        session.user.workspaceId,
        validatedData
      );

      return NextResponse.json({
        success: true,
        note,
      }, { status: 201 });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: fromZodError(validationError as any).message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Failed to create note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 3. `/packages/basic/src/server/api/notes/[id]/route.ts`
```typescript
/**
 * API route for individual note operations
 * Handles GET, PATCH, DELETE
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@ydtb/core/lib/auth";
import { basicService } from "~/services/BasicService";
import { updateNoteSchema } from "~/db/schema";
import { fromZodError } from "zod-validation-error";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    if (!session?.user?.workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const note = await basicService.getNote(
      session.user.workspaceId,
      params.id
    );

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      note,
    });
  } catch (error) {
    console.error("Failed to get note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    if (!session?.user?.workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    try {
      const validatedData = updateNoteSchema.parse(body);
      const note = await basicService.updateNote(
        session.user.workspaceId,
        params.id,
        validatedData
      );

      return NextResponse.json({
        success: true,
        note,
      });
    } catch (validationError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: fromZodError(validationError as any).message,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    console.error("Failed to update note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await auth();
    if (!session?.user?.workspaceId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await basicService.deleteNote(session.user.workspaceId, params.id);

    return NextResponse.json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error && error.message === "Note not found") {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    console.error("Failed to delete note:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 4. `/packages/basic/src/server/api/webhooks.ts`
```typescript
/**
 * Webhook endpoints for external integrations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@ydtb/core/lib/auth";
import { basicService } from "~/services/BasicService";
import crypto from "crypto";

/**
 * Verify webhook signature
 */
function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Handle incoming webhook from external service
 */
export async function handleWebhook(request: NextRequest) {
  try {
    const signature = request.headers.get("x-basic-signature");
    const body = await request.text();

    // Get webhook secret from environment
    const secret = process.env.BASIC_WEBHOOK_SECRET;
    if (!secret) {
      console.error("Webhook secret not configured");
      return NextResponse.json(
        { error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Verify signature
    if (!signature || !verifyWebhookSignature(body, signature, secret)) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      );
    }

    const payload = JSON.parse(body);
    const { event, data } = payload;

    // Handle different webhook events
    switch (event) {
      case "note.created":
        // Handle note creation from external service
        break;

      case "note.updated":
        // Handle note update from external service
        break;

      default:
        return NextResponse.json(
          { error: "Unknown event type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
```

### 5. `/packages/basic/src/server/events/handlers.ts`
```typescript
/**
 * Event handlers for the Basic package
 * Responds to registry and system events
 */

import type { Registry, RegistryEvent } from "@/types/registry";
import { basicService } from "~/services/BasicService";

export async function setupEventHandlers(registry: Registry): Promise<void> {
  // Listen for workspace changes
  registry.on("package:loaded", (event: RegistryEvent) => {
    if (event.packageId === "basic") {
      console.log("Basic package loaded successfully");
      // Initialize any package-specific resources
      initializePackage();
    }
  });

  registry.on("package:unloaded", (event: RegistryEvent) => {
    if (event.packageId === "basic") {
      console.log("Basic package unloaded");
      // Cleanup resources
      cleanupPackage();
    }
  });

  // Listen for tool activation
  registry.on("entry:registered", (event: RegistryEvent) => {
    if (event.entryType === "tool" && event.entryId === "basic") {
      console.log("Basic tool activated");
      // Could trigger analytics or logging
    }
  });

  // Listen for search requests
  registry.on("search:requested", async (event: RegistryEvent) => {
    if (event.data?.query) {
      const results = await handleSearchRequest(
        event.data.workspaceId,
        event.data.query
      );
      // Emit search results
      registry.emit({
        type: "search:results",
        data: { results, query: event.data.query },
        timestamp: new Date(),
      } as any);
    }
  });
}

/**
 * Initialize package resources
 */
async function initializePackage(): Promise<void> {
  // Check if we need to run any migrations
  // Initialize caches
  // Setup background jobs
  console.log("Basic package initialized");
}

/**
 * Cleanup package resources
 */
async function cleanupPackage(): Promise<void> {
  // Clear caches
  // Cancel background jobs
  console.log("Basic package cleaned up");
}

/**
 * Handle search requests from the global search
 */
async function handleSearchRequest(
  workspaceId: string,
  query: string
): Promise<any[]> {
  try {
    const notes = await basicService.searchNotes(workspaceId, query, {
      limit: 5,
    });

    return notes.map((note) => ({
      id: note.id,
      title: note.title,
      description: note.content?.substring(0, 100),
      url: `/tools/basic/note/${note.id}`,
      metadata: {
        type: "note",
        completed: note.completed,
        createdAt: note.createdAt,
      },
    }));
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}
```

### 6. `/packages/basic/src/server/commands/index.ts`
```typescript
/**
 * Command registrations for the Basic package
 * Integrates with the global command palette
 */

import type { Registry } from "@/types/registry";
import { FileText, Plus, ListTodo } from "lucide-react";

export function registerCommands(registry: Registry): void {
  // Create new note command
  registry.registerCommand({
    id: "basic:create-note",
    packageId: "basic",
    title: "Create New Note",
    description: "Create a new note in Basic Notepad",
    hotkey: "cmd+n",
    categories: ["basic", "create"],
    handler: async (context) => {
      // Navigate to new note page
      if (typeof window !== "undefined") {
        window.location.href = `/tools/basic/note/new?workspace=${context.workspaceId}`;
      }
    },
    requiresWorkspace: true,
  });

  // List notes command
  registry.registerCommand({
    id: "basic:list-notes",
    packageId: "basic",
    title: "List All Notes",
    description: "View all notes in Basic Notepad",
    hotkey: "cmd+shift+n",
    categories: ["basic", "navigate"],
    icon: ListTodo,
    handler: async (context) => {
      // Navigate to notes list
      if (typeof window !== "undefined") {
        window.location.href = `/tools/basic/list?workspace=${context.workspaceId}`;
      }
    },
    requiresWorkspace: true,
  });

  // Search notes command
  registry.registerCommand({
    id: "basic:search-notes",
    packageId: "basic",
    title: "Search Notes",
    description: "Search through all notes",
    hotkey: "cmd+shift+f",
    categories: ["basic", "search"],
    handler: async (context) => {
      // Trigger global search with basic filter
      if (typeof window !== "undefined") {
        // Emit search event
        window.dispatchEvent(
          new CustomEvent("command:search", {
            detail: {
              query: "",
              filter: { package: "basic" },
            },
          })
        );
      }
    },
    requiresWorkspace: true,
  });

  // Toggle all notes complete
  registry.registerCommand({
    id: "basic:toggle-all-complete",
    packageId: "basic",
    title: "Mark All as Complete",
    description: "Mark all notes as completed",
    categories: ["basic", "bulk"],
    handler: async (context) => {
      try {
        // Import and call service
        const { basicService } = await import("~/services/BasicService");
        const count = await basicService.updateAllNotesStatus(
          context.workspaceId,
          true
        );

        // Show notification
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("notification", {
              detail: {
                type: "success",
                message: `Marked ${count} notes as complete`,
              },
            })
          );
        }
      } catch (error) {
        console.error("Failed to update notes:", error);
      }
    },
    requiresWorkspace: true,
    requiredPermissions: ["write"],
  });

  // Export notes command
  registry.registerCommand({
    id: "basic:export-notes",
    packageId: "basic",
    title: "Export Notes",
    description: "Export all notes to JSON",
    categories: ["basic", "export"],
    icon: FileText,
    handler: async (context) => {
      try {
        // Import service
        const { basicService } = await import("~/services/BasicService");
        const { notes } = await basicService.listNotes(context.workspaceId);

        // Create and download file
        const blob = new Blob([JSON.stringify(notes, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `notes-${new Date().toISOString().split("T")[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Failed to export notes:", error);
      }
    },
    requiresWorkspace: true,
  });
}
```

### 7. `/packages/basic/src/server/search/provider.ts`
```typescript
/**
 * Search provider for the Basic package
 * Integrates with the global search system
 */

import type { Registry, SearchProviderRegistration, SearchResultItem } from "@/types/registry";
import { basicService } from "~/services/BasicService";
import { FileText, CheckCircle2, Clock } from "lucide-react";

export function registerSearchProvider(registry: Registry): void {
  registry.registerSearchProvider({
    id: "basic-search",
    packageId: "basic",
    name: "Basic Notes",
    description: "Search through your notes and todos",
    categories: ["notes", "todos"],
    requiresWorkspace: true,
    search: async (context) => {
      const { query, workspaceId } = context;

      if (!query.trim()) {
        return [];
      }

      try {
        const notes = await basicService.searchNotes(workspaceId, query, {
          limit: 10,
          includeContent: true,
        });

        return notes.map((note): SearchResultItem => ({
          id: note.id,
          title: note.title,
          description: note.content?.substring(0, 100),
          icon: note.completed ? CheckCircle2 : Clock,
          action: () => {
            if (typeof window !== "undefined") {
              window.location.href = `/tools/basic/note/${note.id}?workspace=${workspaceId}`;
            }
          },
          metadata: {
            type: "note",
            completed: note.completed,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt,
          },
        }));
      } catch (error) {
        console.error("Search failed:", error);
        return [];
      }
    },
  });
}
```

## Files to Update

### 1. Update `/apps/core/src/app/api/basic/notes/route.ts`
Create a proxy route that forwards to the package:

```typescript
import { NextRequest } from "next/server";
import { handleRequest as basicNotesRequest } from "../../../../packages/basic/src/server/api/notes/route";

export const GET = basicNotesRequest;
export const POST = basicNotesRequest;
```

### 2. Add environment variables to `.env.example`
```
# Basic package
BASIC_WEBHOOK_SECRET=your-webhook-secret-here
```

## Validation Checklist

- [ ] Server actions work with RSC
- [ ] API routes handle all CRUD operations
- [ ] Event handlers respond to registry events
- [ ] Commands appear in command palette
- [ ] Search provider integrates with global search
- [ ] Webhooks verify signatures correctly
- [ ] Error handling is comprehensive
- [ ] Authentication is enforced everywhere
- [ ] Rate limiting is implemented
- [ ] Documentation is complete

## Testing the Server Features

1. Test server actions in components
2. Make API calls with curl/Postman
3. Trigger commands from command palette
4. Test global search integration
5. Send test webhooks
6. Verify workspace isolation

## Security Considerations

1. **Authentication**: All endpoints check session
2. **Authorization**: Workspace isolation enforced
3. **Validation**: Input validation with Zod
4. **Rate limiting**: Implement on API routes
5. **Webhooks**: Signature verification

## Next Steps

After implementing server features:
1. Update core components to use the package (Unit 6.1)
2. Implement package initialization (Unit 6.2)
3. Create comprehensive tests (Unit 7.1)