import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, experiencesTable } from "@workspace/db";
import {
  ListExperiencesQueryParams,
  ListExperiencesResponse,
  GetExperienceParams,
  GetExperienceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapExp(e: typeof experiencesTable.$inferSelect) {
  return {
    ...e,
    price: parseFloat(e.price),
    images: e.images ?? [],
    included: e.included ?? [],
    maxParticipants: e.maxParticipants ?? undefined,
  };
}

router.get("/experiences", async (req, res): Promise<void> => {
  const query = ListExperiencesQueryParams.safeParse(req.query);
  if (!query.success) {
    res.status(400).json({ error: query.error.message });
    return;
  }

  const experiences = query.data.category
    ? await db.select().from(experiencesTable).where(eq(experiencesTable.category, query.data.category))
    : await db.select().from(experiencesTable);

  res.json(ListExperiencesResponse.parse(experiences.map(mapExp)));
});

router.get("/experiences/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetExperienceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [exp] = await db.select().from(experiencesTable).where(eq(experiencesTable.id, params.data.id));
  if (!exp) {
    res.status(404).json({ error: "Experience not found" });
    return;
  }

  res.json(GetExperienceResponse.parse(mapExp(exp)));
});

export default router;
