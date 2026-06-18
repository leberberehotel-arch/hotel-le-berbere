import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, restaurantsTable, diningReservationsTable } from "@workspace/db";
import {
  GetRestaurantParams,
  GetRestaurantResponse,
  ListRestaurantsResponse,
  ReserveRestaurantParams,
  ReserveRestaurantBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapRestaurant(r: typeof restaurantsTable.$inferSelect) {
  return {
    ...r,
    images: r.images ?? [],
    menuHighlights: r.menuHighlights ?? [],
  };
}

function generateCode(): string {
  return "RL-D" + Math.random().toString(36).substring(2, 7).toUpperCase();
}

router.get("/restaurants", async (_req, res): Promise<void> => {
  const restaurants = await db.select().from(restaurantsTable);
  res.json(ListRestaurantsResponse.parse(restaurants.map(mapRestaurant)));
});

router.get("/restaurants/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetRestaurantParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [restaurant] = await db.select().from(restaurantsTable).where(eq(restaurantsTable.id, params.data.id));
  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  res.json(GetRestaurantResponse.parse(mapRestaurant(restaurant)));
});

router.post("/restaurants/:id/reserve", async (req, res): Promise<void> => {
  const rawId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ReserveRestaurantParams.safeParse({ id: parseInt(rawId, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ReserveRestaurantBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [restaurant] = await db.select().from(restaurantsTable).where(eq(restaurantsTable.id, params.data.id));
  if (!restaurant) {
    res.status(404).json({ error: "Restaurant not found" });
    return;
  }

  const [reservation] = await db
    .insert(diningReservationsTable)
    .values({
      restaurantId: params.data.id,
      date: body.data.date,
      time: body.data.time,
      guests: body.data.guests,
      guestName: body.data.guestName,
      guestEmail: body.data.guestEmail,
      specialRequests: body.data.specialRequests ?? null,
      confirmationCode: generateCode(),
    })
    .returning();

  res.status(201).json({
    id: reservation.id,
    restaurantId: reservation.restaurantId,
    restaurantName: restaurant.name,
    date: reservation.date,
    time: reservation.time,
    guests: reservation.guests,
    guestName: reservation.guestName,
    guestEmail: reservation.guestEmail,
    specialRequests: reservation.specialRequests ?? undefined,
    confirmationCode: reservation.confirmationCode,
  });
});

export default router;
