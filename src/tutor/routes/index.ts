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
  deleteTestimonial,
  getTestimonials,
  getUserTestimonials,
  postTestimonial,
  testimonialExists,
} from "../controllers/testimonial";
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

// testimonial
router.get("/testimonials", getTestimonials);
router.get("/userTestimonials", auth, getUserTestimonials);
router.get("/testimonial/exists", auth, testimonialExists);
router.post("/testimonial", auth, emailVerificationRequired, postTestimonial);
router.delete("/testimonial/:id", auth, deleteTestimonial);

// tutor profile routes
router.post("/getPublicProfiles", getPublicProfiles);
router.get("/me", auth, getUserTutorProfile);
router.get("/levels", getTutorLevels);
router.post("/", auth, createProfile);
router.put("/", auth, replaceProfile);
router.get("/:urlId", getProfile);
router.delete("/:id", auth, deleteProfile);

export default router;
