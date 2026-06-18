import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, galleryTable } from "@workspace/db";
import { ListGalleryItemsQueryParams, ListGalleryItemsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/gallery", async (req, res): Promise<void> => {
  const query = ListGalleryItemsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let items;
  if (query.data.category) {
    items = await db.select().from(galleryTable).where(eq(galleryTable.category, query.data.category));
  } else if (query.data.type) {
    items = await db.select().from(galleryTable).where(eq(galleryTable.type, query.data.type));
  } else {
    items = await db.select().from(galleryTable);
  }

  res.json(ListGalleryItemsResponse.parse(items));
});

export default router;
