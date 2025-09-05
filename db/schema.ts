import { createInsertSchema } from "drizzle-zod"
import { pgTable, text } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
    id: text().primaryKey(),
    plaidId: text("plaid_id"),
    name: text().notNull(),
    userId: text("user_id").notNull(),
});

export const insertAccountSchema = createInsertSchema(accounts);

export const categories = pgTable("categories", {
    id: text().primaryKey(),
    plaidId: text("plaid_id"),
    name: text().notNull(),
    userId: text("user_id").notNull(),
});

export const insertCategorySchema = createInsertSchema(categories);
