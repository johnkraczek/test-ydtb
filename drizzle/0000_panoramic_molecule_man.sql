CREATE TABLE "ydtb_workspace_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"workspace_id" varchar(20) NOT NULL,
	"user_id" text NOT NULL,
	"role" varchar(50) DEFAULT 'member' NOT NULL,
	"joined_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ydtb_workspaces" (
	"id" varchar(20) PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ydtb_workspace_members" ADD CONSTRAINT "ydtb_workspace_members_workspace_id_ydtb_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."ydtb_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_user_idx" ON "ydtb_workspace_members" USING btree ("workspace_id","user_id");