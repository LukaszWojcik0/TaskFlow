ALTER TABLE "tasks" ADD COLUMN "moved_to_calendar" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "start_time" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "date" text;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "duration" integer;