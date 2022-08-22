import { Router } from "express";
import { body } from "express-validator";
import {
  getListings,
  createListing,
  getListingDetails,
  replaceListing,
  deleteListing,
  uploadListingImage,
} from "../controllers/listing";
import auth from "../../middleware/auth";
import handleValidatorErrors from "../../middleware/handleValidatorErrors";
import imageParser from "../../middleware/imageParser";

const router = Router();

router.get("/", getListings);

router.get("/:id", getListingDetails);

router.post(
  "/",
  auth,
  [body("title").notEmpty().withMessage("Title is a required field")],
  handleValidatorErrors,
  createListing
);

router.put("/:id", auth, replaceListing);

router.delete("/:id", auth, deleteListing);

router.post(
  "/:id/image",
  auth,
  imageParser.single("image"),
  uploadListingImage
);

export default router;
