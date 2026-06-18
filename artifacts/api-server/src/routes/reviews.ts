import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, reviewsTable } from "@workspace/db";
import {
  ListReviewsQueryParams,
  ListReviewsResponse,
  CreateReviewBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapReview(r: typeof reviewsTable.$inferSelect) {
  return {
    ...r,
    rating: parseFloat(r.rating),
    createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
  };
}

router.get("/reviews", async (req, res): Promise<void> => {
  const query = ListReviewsQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  let q = db.select().from(reviewsTable).$dynamic();
  if (query.data.featured === true) {
    q = q.where(eq(reviewsTable.featured, true));
  }

  const reviews = await q.limit(query.data.limit ?? 50);
  res.json(ListReviewsResponse.parse(reviews.map(mapReview)));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const body = CreateReviewBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [review] = await db
    .insert(reviewsTable)
    .values({
      ...body.data,
      rating: body.data.rating.toString(),
      featured: false,
    })
    .returning();

  res.status(201).json(mapReview(review));
});

export default router;
