import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, roomsTable } from "@workspace/db";
import {
  ListRoomsQueryParams,
  ListRoomsResponse,
  GetRoomParams,
  GetRoomResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/rooms", async (req, res): Promise<void> => {
  const query = ListRoomsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const conditions = [];
  if (query.data.category) {
    conditions.push(eq(roomsTable.category, query.data.category));
  }
  if (query.data.maxGuests) {
    const { gte } = await import("drizzle-orm");
    conditions.push(gte(roomsTable.maxGuests, query.data.maxGuests));
  }

  const rooms = conditions.length
    ? await db.select().from(roomsTable).where(and(...conditions))
    : await db.select().from(roomsTable);

  const mapped = rooms.map((r) => ({
    ...r,
    pricePerNight: parseFloat(r.pricePerNight),
    images: r.images ?? [],
    amenities: r.amenities ?? [],
  }));

  res.json(ListRoomsResponse.parse(mapped));
});

router.get("/rooms/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetRoomParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, params.data.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json(GetRoomResponse.parse({
    ...room,
    pricePerNight: parseFloat(room.pricePerNight),
    images: room.images ?? [],
    amenities: room.amenities ?? [],
  }));
});

export default router;
