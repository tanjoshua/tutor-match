import { Router } from "express";
import { body } from "express-validator";
import {
  getInvoices,
  getInvoice,
  createInvoice,
  deleteInvoice,
  replaceInvoice,
  updateState,
  getInvoiceStateCounts,
} from "../controllers/invoice";
import auth from "../../middleware/auth";
import handleValidatorErrors from "../../middleware/handleValidatorErrors";

const router = Router();

router.get("/stateCounts", auth, getInvoiceStateCounts);
router.get("/:id", getInvoice);
router.get("/", auth, getInvoices);

router.post(
  "/",
  auth,
  [body("title").notEmpty().withMessage("Title is a required field")],
  handleValidatorErrors,
  createInvoice
);

router.post("/updateState", auth, updateState);

router.put("/", auth, replaceInvoice);

router.delete("/:id", auth, deleteInvoice);

export default router;
