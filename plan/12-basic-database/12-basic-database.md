# Unit 6.3: Basic Package Database

## Folder: `12-basic-database`

## Purpose
Implement database features for the Basic package, including schema definition, service layer, and CRUD operations. This demonstrates workspace isolation and proper data management patterns for CRM Toolkit packages.

## Context
- Basic package components are implemented (Unit 6.2)
- Package Database Registry is available (Unit 3.4)
- Need to persist note data in the database
- Must follow workspace isolation pattern (all data scoped to workspaceId)
- Should implement service layer pattern for data access
- Need to register schema with Package Database Registry
- Should include proper validation and error handling
- Must support the features used in the UI components

## Definition of Done
- [ ] Database schema defined with workspaceId foreign key
- [ ] Service layer implemented with all CRUD operations
- [ ] Workspace filtering applied to all queries
- [ ] Input validation using Zod schemas
- [ ] Error handling and proper response formats
- [ ] Schema registered with Package Database Registry
- [ ] Migration file generated and registered
- [ ] Indexes created for performance
- [ ] TypeScript types generated from schema

## Database Schema Design

The notes table will include:
- **id**: Primary key (UUID)
- **workspaceId**: Foreign key to workspaces table
- **title**: Note title (required)
- **content**: Note content (optional, text)
- **completed**: Completion status (boolean)
- **metadata**: JSON for additional data
- **createdAt/updatedAt**: Timestamps

## Files to Create

### 1. `/packages/basic/src/db/schema.ts`
```typescript
/**
 * Database schema for the Basic package
 * Extends the core database schema with package-specific tables
 */

import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { workspaces } from "@ydtb/core/lib/db/schema/core";

// Notes table
export const notes = pgTable(
  "basic_notes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    workspaceId: varchar("workspace_id", { length: 20 })
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }).notNull(),
    content: text("content"),
    completed: boolean("completed").default(false).notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    // Index for workspace queries
    workspaceIdx: index("basic_notes_workspace_idx").on(table.workspaceId),
    // Index for title search
    titleIdx: index("basic_notes_title_idx").on(table.title),
    // Index for completion status
    completedIdx: index("basic_notes_completed_idx").on(table.completed),
    // Composite index for common queries
    workspaceCompletedIdx: index("basic_notes_workspace_completed_idx")
      .on(table.workspaceId, table.completed),
  })
);

// Relations
export const notesRelations = relations(notes, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [notes.workspaceId],
    references: [workspaces.id],
  }),
}));

// Zod schemas for validation
export const insertNoteSchema = createInsertSchema(notes, {
  title: (schema) => schema.min(1).max(255),
  content: (schema) => schema.max(10000),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateNoteSchema = insertNoteSchema.partial();

export const selectNoteSchema = createSelectSchema(notes);

// Types
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;
export type UpdateNote = Partial<NewNote>;
```

### 2. `/packages/basic/src/services/BasicService.ts`
```typescript
/**
 * Service layer for Basic package data operations
 * Handles all database interactions with proper workspace isolation
 */

import { eq, and, ilike, desc, asc, count } from "drizzle-orm";
import { db } from "@ydtb/core/lib/db";
import { notes, type Note, type NewNote, type UpdateNote } from "~/db/schema";
import type { NoteFilter } from "~/types";

export class BasicService {
  /**
   * Create a new note
   */
  async createNote(workspaceId: string, data: NewNote): Promise<Note> {
    const [note] = await db
      .insert(notes)
      .values({
        ...data,
        workspaceId,
      })
      .returning();

    return note;
  }

  /**
   * Get a note by ID (workspace-scoped)
   */
  async getNote(workspaceId: string, noteId: string): Promise<Note | null> {
    const [note] = await db
      .select()
      .from(notes)
      .where(
        and(
          eq(notes.id, noteId),
          eq(notes.workspaceId, workspaceId)
        )
      )
      .limit(1);

    return note || null;
  }

  /**
   * List notes with filtering and pagination
   */
  async listNotes(
    workspaceId: string,
    filter: NoteFilter = {}
  ): Promise<{ notes: Note[]; total: number }> {
    // Build query conditions
    const conditions = [eq(notes.workspaceId, workspaceId)];

    // Add completion filter if specified
    if (filter.completed !== undefined) {
      conditions.push(eq(notes.completed, filter.completed));
    }

    // Add search filter if specified
    if (filter.search) {
      conditions.push(
        ilike(notes.title, `%${filter.search}%`)
      );
    }

    // Get total count
    const [{ total }] = await db
      .select({ total: count() })
      .from(notes)
      .where(and(...conditions));

    // Build query
    let query = db
      .select()
      .from(notes)
      .where(and(...conditions))
      .orderBy(desc(notes.updatedAt));

    // Apply pagination
    if (filter.offset) {
      query = query.offset(filter.offset);
    }
    if (filter.limit) {
      query = query.limit(filter.limit);
    }

    const notesList = await query;

    return {
      notes: notesList,
      total,
    };
  }

  /**
   * Update a note
   */
  async updateNote(
    workspaceId: string,
    noteId: string,
    data: UpdateNote
  ): Promise<Note> {
    const [note] = await db
      .update(notes)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(notes.id, noteId),
          eq(notes.workspaceId, workspaceId)
        )
      )
      .returning();

    if (!note) {
      throw new Error("Note not found");
    }

    return note;
  }

  /**
   * Delete a note
   */
  async deleteNote(workspaceId: string, noteId: string): Promise<void> {
    const result = await db
      .delete(notes)
      .where(
        and(
          eq(notes.id, noteId),
          eq(notes.workspaceId, workspaceId)
        )
      );

    if (result.rowCount === 0) {
      throw new Error("Note not found");
    }
  }

  /**
   * Toggle completion status
   */
  async toggleNoteComplete(
    workspaceId: string,
    noteId: string
  ): Promise<Note> {
    // Get current note
    const note = await this.getNote(workspaceId, noteId);
    if (!note) {
      throw new Error("Note not found");
    }

    // Toggle and update
    return this.updateNote(workspaceId, noteId, {
      completed: !note.completed,
    });
  }

  /**
   * Mark all notes as completed/incomplete
   */
  async updateAllNotesStatus(
    workspaceId: string,
    completed: boolean
  ): Promise<number> {
    const result = await db
      .update(notes)
      .set({
        completed,
        updatedAt: new Date(),
      })
      .where(eq(notes.workspaceId, workspaceId));

    return result.rowCount || 0;
  }

  /**
   * Search notes (full-text search in title and content)
   */
  async searchNotes(
    workspaceId: string,
    query: string,
    options: {
      limit?: number;
      includeContent?: boolean;
    } = {}
  ): Promise<Note[]> {
    const searchConditions = [
      eq(notes.workspaceId, workspaceId),
      ilike(notes.title, `%${query}%`),
    ];

    // Also search content if requested
    if (options.includeContent) {
      searchConditions.push(ilike(notes.content, `%${query}%`));
    }

    let dbQuery = db
      .select()
      .from(notes)
      .where(and(...searchConditions))
      .orderBy(desc(notes.updatedAt));

    if (options.limit) {
      dbQuery = dbQuery.limit(options.limit);
    }

    return dbQuery;
  }

  /**
   * Get statistics for the workspace
   */
  async getStats(workspaceId: string): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    const [stats] = await db
      .select({
        total: count(),
        completed: count().where(eq(notes.completed, true)),
      })
      .from(notes)
      .where(eq(notes.workspaceId, workspaceId));

    return {
      total: stats.total,
      completed: stats.completed,
      pending: stats.total - stats.completed,
    };
  }
}

// Export singleton instance
export const basicService = new BasicService();
```

### 3. `/apps/core/src/lib/db/schema/basic.ts`
```typescript
/**
 * Export Basic package schema from core for migrations
 * This file is used to include package schemas in core migrations
 */

export * from "../../../../packages/basic/src/db/schema";
```

### 4. Create migration file
File to be generated at `/apps/core/drizzle/0004_basic_notes.sql`:
```sql
-- Create basic_notes table
CREATE TABLE IF NOT EXISTS "basic_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" varchar(20) NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text,
	"completed" boolean DEFAULT false NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "basic_notes_workspace_idx" ON "basic_notes" ("workspace_id");
CREATE INDEX IF NOT EXISTS "basic_notes_title_idx" ON "basic_notes" ("title");
CREATE INDEX IF NOT EXISTS "basic_notes_completed_idx" ON "basic_notes" ("completed");
CREATE INDEX IF NOT EXISTS "basic_notes_workspace_completed_idx" ON "basic_notes" ("workspace_id", "completed");

-- Add foreign key constraint
ALTER TABLE "basic_notes" ADD CONSTRAINT "basic_notes_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspaces"("id") ON DELETE no action ON UPDATE no action;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_basic_notes_updated_at BEFORE UPDATE
    ON basic_notes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 5. Update `/apps/core/drizzle.config.ts`
```typescript
import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });

export default {
  schema: ["./src/lib/db/schema/core.ts", "./src/lib/db/schema/basic.ts"],
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  verbose: true,
  strict: true,
} satisfies Config;
```

## Files to Update

### 1. Update `/packages/basic/src/components/NoteList.tsx`
Replace mock data with actual service calls:

```typescript
// Update the loadNotes function
async function loadNotes() {
  setIsLoading(true);
  try {
    // Import the service
    const { basicService } = await import("~/services/BasicService");

    const filter: NoteFilter = {
      search: searchQuery,
      completed: showCompleted,
    };

    const { notes: notesList } = await basicService.listNotes(props.workspaceId, filter);
    setNotes(notesList);
  } catch (error) {
    console.error("Failed to load notes:", error);
  } finally {
    setIsLoading(false);
  }
}

// Update the toggle function
const handleToggleComplete = async (noteId: string, completed: boolean) => {
  try {
    const { basicService } = await import("~/services/BasicService");
    await basicService.toggleNoteComplete(props.workspaceId, noteId);

    setNotes(prev =>
      prev.map(note =>
        note.id === noteId ? { ...note, completed: !completed } : note
      )
    );
  } catch (error) {
    console.error("Failed to update note:", error);
  }
};
```

### 2. Update `/packages/basic/src/components/NoteDetail.tsx`
Replace mock API calls with service calls:

```typescript
// Update loadNote function
async function loadNote() {
  setIsLoading(true);
  setError(null);

  try {
    const { basicService } = await import("~/services/BasicService");
    const noteData = await basicService.getNote(props.workspaceId, noteId);
    setNote(noteData);
  } catch (error) {
    console.error("Failed to load note:", error);
    setError("Failed to load note");
  } finally {
    setIsLoading(false);
  }
}

// Update handleSave function
async function handleSave() {
  if (!note?.title?.trim()) {
    setError("Title is required");
    return;
  }

  setIsSaving(true);
  setError(null);

  try {
    const { basicService } = await import("~/services/BasicService");

    let savedNote: Note;
    if (isNewNote) {
      savedNote = await basicService.createNote(props.workspaceId, {
        title: note.title,
        content: note.content || "",
        completed: note.completed || false,
      });
    } else {
      savedNote = await basicService.updateNote(props.workspaceId, noteId!, {
        title: note.title,
        content: note.content,
        completed: note.completed,
      });
    }

    if (isNewNote) {
      router.replace(props.navigation.navigate(["note", savedNote.id]));
    } else {
      setNote(savedNote);
    }

    setHasChanges(false);
  } catch (error) {
    console.error("Failed to save note:", error);
    setError("Failed to save note");
  } finally {
    setIsSaving(false);
  }
}

// Update handleDelete function
async function handleDelete() {
  if (!note?.id || isNewNote) return;

  if (!confirm("Are you sure you want to delete this note?")) {
    return;
  }

  try {
    const { basicService } = await import("~/services/BasicService");
    await basicService.deleteNote(props.workspaceId, note.id);
    router.push(props.navigation.navigate(["list"]));
  } catch (error) {
    console.error("Failed to delete note:", error);
    setError("Failed to delete note");
  }
}
```

## Validation Checklist

- [ ] Database schema created with all required fields
- [ ] Foreign key to workspaces table established
- [ ] All CRUD operations implemented
- [ ] Workspace filtering applied to all queries
- [ ] Input validation using Zod schemas
- [ ] Error handling for all operations
- [ ] Migration generated and can run
- [ ] Indexes created for performance
- [ ] TypeScript types generated
- [ ] Components updated to use service

## Testing the Database

1. Run the migration: `npm run db:migrate`
2. Create a note and verify it's saved
3. Edit a note and verify changes persist
4. Delete a note and verify it's removed
5. Check workspace isolation (notes don't appear in other workspaces)
6. Test search functionality

## Performance Considerations

1. **Indexes**: Created for common query patterns
2. **Pagination**: Implemented in list queries
3. **Workspace isolation**: enforced at database level
4. **Soft deletes**: Consider adding for data recovery

## Next Steps

After implementing database features:
1. Create server-side API routes (Unit 5.4)
2. Implement search integration
3. Add comprehensive testing (Unit 7.1)