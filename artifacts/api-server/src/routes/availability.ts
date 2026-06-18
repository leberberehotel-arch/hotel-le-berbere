import { Router, type IRouter } from "express";
import { and, gte, lte, eq } from "drizzle-orm";
import { db, roomsTable, bookingsTable } from "@workspace/db";
import { CheckAvailabilityQueryParams, CheckAvailabilityResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/availability", async (req, res): Promise<void> => {
  const query = CheckAvailabilityQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const { checkIn, checkOut, guests } = query.data;

  // Find bookings that overlap with the requested period
  const overlappingBookings = await db
    .select({ roomId: bookingsTable.roomId })
    .from(bookingsTable)
    .where(
      and(
        eq(bookingsTable.status, "confirmed"),
        lte(bookingsTable.checkIn, checkOut),
        gte(bookingsTable.checkOut, checkIn)
      )
    );

  const bookedRoomIds = new Set(overlappingBookings.map((b) => b.roomId));

  const allRooms = await db
    .select()
    .from(roomsTable)
    .where(eq(roomsTable.available, true));

  const availableRooms = allRooms.filter(
    (r) => !bookedRoomIds.has(r.id) && r.maxGuests >= guests
  );

  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.max(
    1,
    Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  const mapped = availableRooms.map((r) => ({
    ...r,
    pricePerNight: parseFloat(r.pricePerNight),
    images: r.images ?? [],
    amenities: r.amenities ?? [],
  }));

  res.json(
    CheckAvailabilityResponse.parse({
      checkIn,
      checkOut,
      guests,
      nights,
      availableRooms: mapped,
    })
  );
});

export default router;
