import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  ddl: integer("ddl").notNull(),
  completed: boolean("completed").notNull().default(false),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Task = InferSelectModel<typeof tasks>;
export type TaskInsert = InferInsertModel<typeof tasks>;
