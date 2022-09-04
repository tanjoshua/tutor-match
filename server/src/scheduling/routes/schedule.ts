import { Router } from "express";
import auth from "../../middleware/auth";
import {
  createSchedule,
  deleteSchedule,
  getAvailableSlots,
  getOwnerSchedule,
  replaceSchedule,
} from "../controllers/schedule";

const router = Router();

// get schedule for owner (all slots marked as available + previously available slots that are now taken)
router.get("/owner", auth, getOwnerSchedule);

// create or update schedule
router.post("/", auth, createSchedule);

router.put("/", auth, replaceSchedule);

// get available slots
router.get("/available", getAvailableSlots);

router.delete("/", auth, deleteSchedule);

export default router;
