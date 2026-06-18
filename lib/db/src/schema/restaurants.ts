import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const restaurantsTable = pgTable("restaurants", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cuisine: text("cuisine").notNull(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  dressCode: text("dress_code"),
  openHours: text("open_hours"),
  capacity: integer("capacity"),
  chefName: text("chef_name"),
  chefBio: text("chef_bio"),
  images: text("images").array().notNull().default([]),
  menuHighlights: text("menu_highlights").array().notNull().default([]),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const diningReservationsTable = pgTable("dining_reservations", {
  id: serial("id").primaryKey(),
  restaurantId: integer("restaurant_id").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  guests: integer("guests").notNull(),
  guestName: text("guest_name").notNull(),
  guestEmail: text("guest_email").notNull(),
  specialRequests: text("special_requests"),
  confirmationCode: text("confirmation_code").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertRestaurantSchema = createInsertSchema(restaurantsTable).omit({ id: true, createdAt: true });
export type InsertRestaurant = z.infer<typeof insertRestaurantSchema>;
export type Restaurant = typeof restaurantsTable.$inferSelect;
export type DiningReservation = typeof diningReservationsTable.$inferSelect;
