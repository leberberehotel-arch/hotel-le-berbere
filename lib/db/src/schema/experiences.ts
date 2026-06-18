import { pgTable, serial, text, integer, numeric, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const experiencesTable = pgTable("experiences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  duration: text("duration").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  maxParticipants: integer("max_participants"),
  images: text("images").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  included: text("included").array().notNull().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertExperienceSchema = createInsertSchema(experiencesTable).omit({ id: true, createdAt: true });
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiencesTable.$inferSelect;
