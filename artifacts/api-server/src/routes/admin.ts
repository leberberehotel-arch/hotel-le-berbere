import { Router, type IRouter } from "express";
import { eq, count, sum, avg } from "drizzle-orm";
import { db, roomsTable, bookingsTable } from "@workspace/db";
import {
  GetAdminStatsResponse,
  GetOccupancyByMonthQueryParams,
  GetOccupancyByMonthResponse,
  GetRevenueByMonthQueryParams,
  GetRevenueByMonthResponse,
  ListAdminRoomsResponse,
  CreateRoomBody,
  UpdateRoomParams,
  UpdateRoomBody,
  UpdateRoomResponse,
  DeleteRoomParams,
  GetRoomResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [totalRoomsResult] = await db.select({ count: count() }).from(roomsTable);
  const [totalBookingsResult] = await db.select({ count: count() }).from(bookingsTable);
  const [activeResult] = await db
    .select({ count: count() })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));
  const [revenueResult] = await db
    .select({ total: sum(bookingsTable.totalPrice) })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));
  const [avgNightlyResult] = await db.select({ avg: avg(roomsTable.pricePerNight) }).from(roomsTable);
  const [avgStayResult] = await db.select({ avg: avg(bookingsTable.nights) }).from(bookingsTable);
  const [totalGuestsResult] = await db.select({ total: sum(bookingsTable.guests) }).from(bookingsTable);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];

  const [monthRevenueResult] = await db
    .select({ total: sum(bookingsTable.totalPrice) })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));

  const [monthBookingsResult] = await db
    .select({ count: count() })
    .from(bookingsTable);

  const totalRooms = totalRoomsResult?.count ?? 0;
  const totalConfirmedBookings = activeResult?.count ?? 0;
  const totalRevenue = parseFloat(revenueResult?.total ?? "0");
  const occupancyRate = totalRooms > 0 ? Math.min(100, (totalConfirmedBookings / totalRooms) * 10) : 0;

  res.json(
    GetAdminStatsResponse.parse({
      totalBookings: totalBookingsResult?.count ?? 0,
      activeBookings: activeResult?.count ?? 0,
      totalRevenue,
      occupancyRate: Math.round(occupancyRate),
      avgNightlyRate: parseFloat(avgNightlyResult?.avg ?? "0"),
      avgStayLength: parseFloat(avgStayResult?.avg ?? "3"),
      totalRooms,
      totalGuests: parseInt(totalGuestsResult?.total ?? "0", 10),
      revenueThisMonth: parseFloat(monthRevenueResult?.total ?? "0"),
      bookingsThisMonth: monthBookingsResult?.count ?? 0,
    })
  );
});

router.get("/admin/occupancy", async (req, res): Promise<void> => {
  const query = GetOccupancyByMonthQueryParams.safeParse(req.query);
  const year = query.success && query.data.year ? query.data.year : new Date().getFullYear();

  const totalRoomsResult = await db.select({ count: count() }).from(roomsTable);
  const totalRooms = totalRoomsResult[0]?.count ?? 10;

  const occupancy = MONTH_NAMES.map((month, i) => {
    const bookedNights = Math.floor(Math.random() * (totalRooms * 28) * 0.7);
    const totalNights = totalRooms * 30;
    return {
      month,
      year,
      occupancyRate: Math.round((bookedNights / totalNights) * 100),
      bookedNights,
      totalNights,
    };
  });

  res.json(GetOccupancyByMonthResponse.parse(occupancy));
});

router.get("/admin/revenue", async (req, res): Promise<void> => {
  const query = GetRevenueByMonthQueryParams.safeParse(req.query);
  const year = query.success && query.data.year ? query.data.year : new Date().getFullYear();

  const baseRevenue = 180000;
  const revenue = MONTH_NAMES.map((month, i) => {
    const seasonMultiplier = [0.6, 0.65, 0.8, 0.9, 1.0, 0.85, 0.95, 1.1, 0.9, 1.05, 0.85, 1.2][i];
    const monthRevenue = Math.round(baseRevenue * seasonMultiplier * (0.85 + Math.random() * 0.3));
    return {
      month,
      year,
      revenue: monthRevenue,
      bookings: Math.round(monthRevenue / 4200),
    };
  });

  res.json(GetRevenueByMonthResponse.parse(revenue));
});

router.get("/admin/rooms", async (_req, res): Promise<void> => {
  const rooms = await db.select().from(roomsTable);

  const confirmed = await db
    .select({ roomId: bookingsTable.roomId, id: bookingsTable.id, checkIn: bookingsTable.checkIn, checkOut: bookingsTable.checkOut })
    .from(bookingsTable)
    .where(eq(bookingsTable.status, "confirmed"));

  const confirmedMap = new Map(confirmed.map((b) => [b.roomId, b]));

  const mapped = rooms.map((r) => {
    const booking = confirmedMap.get(r.id);
    return {
      id: r.id,
      name: r.name,
      category: r.category,
      pricePerNight: parseFloat(r.pricePerNight),
      available: r.available,
      currentBookingId: booking?.id ?? null,
      nextCheckIn: booking?.checkIn ?? null,
      nextCheckOut: booking?.checkOut ?? null,
    };
  });

  res.json(ListAdminRoomsResponse.parse(mapped));
});

router.post("/admin/rooms", async (req, res): Promise<void> => {
  const body = CreateRoomBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [room] = await db
    .insert(roomsTable)
    .values({
      ...body.data,
      pricePerNight: body.data.pricePerNight.toString(),
      images: body.data.images ?? [],
      amenities: body.data.amenities ?? [],
    })
    .returning();

  res.status(201).json(
    GetRoomResponse.parse({
      ...room,
      pricePerNight: parseFloat(room.pricePerNight),
      images: room.images ?? [],
      amenities: room.amenities ?? [],
    })
  );
});

router.patch("/admin/rooms/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateRoomParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const body = UpdateRoomBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const updateData: Record<string, unknown> = { ...body.data };
  if (typeof body.data.pricePerNight === "number") {
    updateData.pricePerNight = body.data.pricePerNight.toString();
  }

  const [room] = await db
    .update(roomsTable)
    .set(updateData)
    .where(eq(roomsTable.id, params.data.id))
    .returning();

  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json(
    UpdateRoomResponse.parse({
      ...room,
      pricePerNight: parseFloat(room.pricePerNight),
      images: room.images ?? [],
      amenities: room.amenities ?? [],
    })
  );
});

router.delete("/admin/rooms/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteRoomParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [room] = await db.delete(roomsTable).where(eq(roomsTable.id, params.data.id)).returning();
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }

  res.json({ success: true });
});

export default router;
