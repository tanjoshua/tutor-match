import { Router } from "express";
import auth from "../../middleware/auth";
import {
  getProfile,
  getPublicProfiles,
  createProfile,
  replaceProfile,
  deleteProfile,
} from "../controllers/profile";

const router = Router();

router.get("/public", getPublicProfiles);

router.post("/", auth, createProfile);

router.put("/", auth, replaceProfile);

router.get("/:id", getProfile);

router.delete("/:id", auth, deleteProfile);

export default router;
