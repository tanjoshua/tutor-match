import { Router } from "express";
import { getCurrentUser } from "../controllers/user";

const router = Router();

router.get("/me", getCurrentUser);

export default router;
