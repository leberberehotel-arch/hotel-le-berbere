import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, bookingsTable, roomsTable } from "@workspace/db";
import {
  ListBookingsQueryParams,
  ListBookingsResponse,
  CreateBookingBody,
  GetBookingParams,
  GetBookingResponse,
  UpdateBookingParams,
  UpdateBookingBody,
  UpdateBookingResponse,
  CancelBookingParams,
  CancelBookingResponse,
  ConfirmBookingParams,
  ConfirmBookingBody,
  ConfirmBookingResponse,
} from "@workspace/api-zod";

function generateConfirmationCode(): string {
  return "RL" + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function mapBooking(b: typeof bookingsTable.$inferSelect, roomName?: string) {
  return {
    ...b,
    totalPrice: parseFloat(b.totalPrice),
    roomName: roomName ?? "",
    createdAt: b.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

const router: IRouter = Router();

router.get("/bookings", async (req, res): Promise<void> => {
  const query = ListBookingsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let q = db.select().from(bookingsTable).$dynamic();
  if (query.data.status) {
    q = q.where(eq(bookingsTable.status, query.data.status));
  }

  const bookings = await q.limit(query.data.limit ?? 50).offset(query.data.offset ?? 0);

  const roomIds = [...new Set(bookings.map((b) => b.roomId))];
  const rooms = roomIds.length
    ? await db.select({ id: roomsTable.id, name: roomsTable.name }).from(roomsTable)
    : [];
  const roomMap = new Map(rooms.map((r) => [r.id, r.name]));

  const mapped = bookings.map((b) => mapBooking(b, roomMap.get(b.roomId) ?? ""));
  res.json(ListBookingsResponse.parse(mapped));
});

router.post("/bookings", async (req, res): Promise<void> => {
  const parsed = CreateBookingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialRequests } = parsed.data;

  const [room] = await db.select().from(roomsTable).where(eq(roomsTable.id, roomId));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(
    1,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const totalPrice = parseFloat(room.pricePerNight) * nights;
  const confirmationCode = generateConfirmationCode();

  const [booking] = await db
    .insert(bookingsTable)
    .values({
      roomId,
      checkIn,
      checkOut,
      guests,
      nights,
      status: "pending",
      totalPrice: totalPrice.toString(),
      guestName,
      guestEmail,
      guestPhone: guestPhone ?? null,
      specialRequests: specialRequests ?? null,
      confirmationCode,
    })
    .returning();

  res.status(201).json(GetBookingResponse.parse(mapBooking(booking, room.name)));
});

router.get("/bookings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetBookingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db.select().from(bookingsTable).where(eq(bookingsTable.id, params.data.id));
  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [room] = await db.select({ name: roomsTable.name }).from(roomsTable).where(eq(roomsTable.id, booking.roomId));
  res.json(GetBookingResponse.parse(mapBooking(booking, room?.name ?? "")));
});

router.patch("/bookings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateBookingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateBookingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set(body.data)
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [room] = await db.select({ name: roomsTable.name }).from(roomsTable).where(eq(roomsTable.id, booking.roomId));
  res.json(UpdateBookingResponse.parse(mapBooking(booking, room?.name ?? "")));
});

router.delete("/bookings/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = CancelBookingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set({ status: "cancelled" })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  res.json(CancelBookingResponse.parse(mapBooking(booking)));
});

router.post("/bookings/:id/confirm", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = ConfirmBookingParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = ConfirmBookingBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [booking] = await db
    .update(bookingsTable)
    .set({ status: "confirmed" })
    .where(eq(bookingsTable.id, params.data.id))
    .returning();

  if (!booking) {
    res.status(404).json({ error: "Booking not found" });
    return;
  }

  const [room] = await db.select({ name: roomsTable.name }).from(roomsTable).where(eq(roomsTable.id, booking.roomId));
  res.json(ConfirmBookingResponse.parse(mapBooking(booking, room?.name ?? "")));
});

export default router;
