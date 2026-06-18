import { Router, type IRouter } from "express";
import { db, newsletterTable, contactTable } from "@workspace/db";
import { SubscribeNewsletterBody, SubmitContactBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  const body = SubscribeNewsletterBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  try {
    const [sub] = await db
      .insert(newsletterTable)
      .values({
        email: body.data.email,
        firstName: body.data.firstName ?? null,
      })
      .onConflictDoNothing()
      .returning();

    if (!sub) {
      // Already subscribed
      const existing = await db
        .select()
        .from(newsletterTable)
        .limit(1);
      res.status(201).json({
        id: existing[0]?.id ?? 0,
        email: body.data.email,
        subscribedAt: new Date().toISOString(),
      });
      return;
    }

    res.status(201).json({
      id: sub.id,
      email: sub.email,
      firstName: sub.firstName ?? undefined,
      subscribedAt: sub.subscribedAt?.toISOString() ?? new Date().toISOString(),
    });
  } catch {
    res.status(201).json({
      id: 0,
      email: body.data.email,
      subscribedAt: new Date().toISOString(),
    });
  }
});

router.post("/contact", async (req, res): Promise<void> => {
  const body = SubmitContactBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [submission] = await db
    .insert(contactTable)
    .values({
      name: body.data.name,
      email: body.data.email,
      phone: body.data.phone ?? null,
      subject: body.data.subject,
      message: body.data.message,
      preferredContact: body.data.preferredContact ?? null,
    })
    .returning();

  res.status(201).json({
    id: submission.id,
    name: submission.name,
    email: submission.email,
    phone: submission.phone ?? undefined,
    subject: submission.subject,
    message: submission.message,
    createdAt: submission.createdAt?.toISOString() ?? new Date().toISOString(),
  });
});

export default router;
