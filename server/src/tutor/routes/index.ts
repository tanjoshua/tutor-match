import { Router } from "express";
import auth from "../../middleware/auth";
import {
  getProfile,
  getPublicProfiles,
  createProfile,
  replaceProfile,
  deleteProfile,
  getUserTutorProfile,
  getTutorLevels,
} from "../controllers/profile";
import {
  applyToTutorRequest,
  createTutorRequest,
  deleteTutorRequest,
  getTutorRequest,
  getTutorRequests,
  replaceTutorRequest,
  withdrawApplication,
  tutorHasApplied,
} from "../controllers/request";

const router = Router();

// tutor request routes
router.get("/request/:id", getTutorRequest);
router.get("/request", getTutorRequests);
router.post("/request", createTutorRequest);
router.put("/request", replaceTutorRequest);
router.delete("/request/:id", deleteTutorRequest);

router.post("/apply-request", auth, applyToTutorRequest);
router.post("/withdraw-request", auth, withdrawApplication);
router.get("/applied", auth, tutorHasApplied);

// tutor profile routes
router.get("/public", getPublicProfiles);
router.get("/me", auth, getUserTutorProfile);
router.get("/levels", getTutorLevels);
router.post("/", auth, createProfile);
router.put("/", auth, replaceProfile);
router.get("/:id", getProfile);
router.delete("/:id", auth, deleteProfile);

export default router;
