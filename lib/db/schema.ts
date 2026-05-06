import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Generic items table — replace with your app's data model
export const items = sqliteTable('items', {
  id:        text('id').primaryKey(),            // uuid
  title:     text('title').notNull(),
  body:      text('body'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
});

// ─── Inferred types ─────────────────────────────────────────────────────────
export type Item    = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
