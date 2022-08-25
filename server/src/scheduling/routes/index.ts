import { Router } from "express";
import appointment from "./appointment";
import schedule from "./schedule";

const router = Router();

router.use("/appointment", appointment);

router.use("/schedule", schedule);

export default router;
