import { Router } from "express";
import auth from "../../middleware/auth";
import profilePicUpload from "../../middleware/profilePicUpload";
import {
  contactTutorFromBrowse,
  contactTutorFromRequest,
} from "../controllers/contact";
import {
  getProfile,
  getPublicProfiles,
  createProfile,
  replaceProfile,
  deleteProfile,
  getUserTutorProfile,
  getTutorLevels,
  uploadProfilePicture,
  deleteProfilePicture,
  samplePublicProfiles,
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
  closeTutorRequest,
} from "../controllers/request";
import {
  deleteRating,
  getRatings,
  getUserRatings,
  postRating,
  ratingExists,
} from "../controllers/rating";
import emailVerificationRequired from "../../middleware/emailVerificationRequired";

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
router.post("/requestClient/closeRequest", closeTutorRequest);

// tutor side
router.post("/applyRequest", auth, applyToTutorRequest);
router.post("/withdrawRequest", auth, withdrawApplication);
router.get("/applied", auth, tutorHasApplied);

router.post("/contact/browse", contactTutorFromBrowse);
router.post("/contact/tutorRequest", contactTutorFromRequest);

// tutor profile image routes
router.post(
  "/uploadProfilePicture",
  auth,
  profilePicUpload.single("profilePicture"),
  uploadProfilePicture
);
router.post("/deleteProfilePicture", auth, deleteProfilePicture);

// ratings
router.get("/ratings", getRatings);
router.get("/userRatings", auth, getUserRatings);
router.get("/rating/exists", auth, ratingExists);
router.post("/rating", auth, emailVerificationRequired, postRating);
router.delete("/rating/:id", auth, deleteRating);

// tutor profile routes
router.get("/samplePublicProfiles", samplePublicProfiles);
router.post("/getPublicProfiles", getPublicProfiles);
router.get("/me", auth, getUserTutorProfile);
router.get("/levels", getTutorLevels);
router.post("/", auth, createProfile);
router.put("/", auth, replaceProfile);
router.get("/:urlId", getProfile);
router.delete("/:id", auth, deleteProfile);

export default router;
