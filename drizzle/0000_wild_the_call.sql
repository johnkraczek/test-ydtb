CREATE TABLE "ydtb_accounts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"account_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "ydtb_passkeys" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"public_key" text NOT NULL,
	"user_id" text NOT NULL,
	"credential_id" text NOT NULL,
	"counter" integer DEFAULT 0 NOT NULL,
	"device_type" text NOT NULL,
	"backed_up" boolean DEFAULT false NOT NULL,
	"transports" text,
	"created_at" timestamp DEFAULT now(),
	"aaguid" text,
	CONSTRAINT "ydtb_passkeys_credential_id_unique" UNIQUE("credential_id")
);
--> statement-breakpoint
CREATE TABLE "ydtb_sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ydtb_sessions_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "ydtb_users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false,
	"image" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "ydtb_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "ydtb_verifications" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
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
ALTER TABLE "ydtb_accounts" ADD CONSTRAINT "ydtb_accounts_user_id_ydtb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ydtb_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ydtb_passkeys" ADD CONSTRAINT "ydtb_passkeys_user_id_ydtb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ydtb_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ydtb_sessions" ADD CONSTRAINT "ydtb_sessions_user_id_ydtb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ydtb_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ydtb_workspace_members" ADD CONSTRAINT "ydtb_workspace_members_workspace_id_ydtb_workspaces_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."ydtb_workspaces"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ydtb_workspace_members" ADD CONSTRAINT "ydtb_workspace_members_user_id_ydtb_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."ydtb_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "accounts_provider_account_idx" ON "ydtb_accounts" USING btree ("provider_id","account_id");--> statement-breakpoint
CREATE INDEX "passkeys_credential_id_idx" ON "ydtb_passkeys" USING btree ("credential_id");--> statement-breakpoint
CREATE INDEX "sessions_token_idx" ON "ydtb_sessions" USING btree ("token");--> statement-breakpoint
CREATE INDEX "workspace_members_workspace_user_idx" ON "ydtb_workspace_members" USING btree ("workspace_id","user_id");