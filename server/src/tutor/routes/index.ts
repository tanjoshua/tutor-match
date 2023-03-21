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
  getTutorApplications,
  updateTutorApplicationState,
  getTutorApplication,
  getAppliedRequests,
} from "../controllers/request";

const router = Router();

// tutor request routes
router.post("/getRequests", auth, getTutorRequests);
router.get("/appliedRequests", auth, getAppliedRequests);
router.get("/request/:id", getTutorRequest);
router.post("/request", createTutorRequest);
router.put("/request", replaceTutorRequest);
router.delete("/request/:id", deleteTutorRequest);

// client side
router.get("/requestClient/apps", getTutorApplications);
router.get("/requestClient/application", getTutorApplication);
router.post("/requestClient/updateAppState", updateTutorApplicationState);

// tutor side
router.post("/applyRequest", auth, applyToTutorRequest);
router.post("/withdrawRequest", auth, withdrawApplication);
router.get("/applied", auth, tutorHasApplied);

// tutor profile routes
router.post("/getPublicProfiles", getPublicProfiles);
router.get("/me", auth, getUserTutorProfile);
router.get("/levels", getTutorLevels);
router.post("/", auth, createProfile);
router.put("/", auth, replaceProfile);
router.get("/:id", getProfile);
router.delete("/:id", auth, deleteProfile);

export default router;
