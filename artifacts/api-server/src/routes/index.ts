import { Router, type IRouter } from "express";
import healthRouter from "./health";
import roomsRouter from "./rooms";
import availabilityRouter from "./availability";
import bookingsRouter from "./bookings";
import experiencesRouter from "./experiences";
import restaurantsRouter from "./restaurants";
import galleryRouter from "./gallery";
import reviewsRouter from "./reviews";
import newsletterRouter from "./newsletter";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(roomsRouter);
router.use(availabilityRouter);
router.use(bookingsRouter);
router.use(experiencesRouter);
router.use(restaurantsRouter);
router.use(galleryRouter);
router.use(reviewsRouter);
router.use(newsletterRouter);
router.use(adminRouter);

export default router;
