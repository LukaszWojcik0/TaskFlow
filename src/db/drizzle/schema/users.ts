import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type User = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
