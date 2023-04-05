import { Router } from "express";
import { body } from "express-validator";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
  changeEmail,
  changePassword,
  googleLogin,
  googleRegister,
  requestEmailVerification,
  verifyEmailViaToken,
  verifyEmailViaGoogle,
  becomeTutor,
} from "../controllers/auth";
import handleValidatorErrors from "../../middleware/handleValidatorErrors";
import auth from "../../middleware/auth";

const router = Router();

// login and registering
router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("name").trim().notEmpty().withMessage("Name cannot be empty"),
  ],
  handleValidatorErrors,
  register
);
router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail().withMessage("Enter a valid email"),
    body("password").trim().notEmpty().withMessage("Password cannot be empty"),
  ],
  handleValidatorErrors,
  login
);
router.post("/googleLogin", googleLogin);
router.post("/googleRegister", googleRegister);

// ACCOUNT TYPES
router.post("/becomeTutor", auth, becomeTutor);

// EMAIL VERIFICATION
router.post("/requestEmailVerification", requestEmailVerification);
router.post("/verifyEmailViaToken", verifyEmailViaToken);
router.post("/verifyEmailViaGoogle", verifyEmailViaGoogle);

router.post("/logout", logout);

router.post(
  "/forgotPassword",
  [body("email").isEmail().normalizeEmail().withMessage("Enter a valid email")],
  handleValidatorErrors,
  forgotPassword
);

router.post(
  "/resetPassword",
  [
    body("token").notEmpty(),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  handleValidatorErrors,
  resetPassword
);

router.post(
  "/changeEmail",
  auth,
  [body("newEmail").notEmpty().isEmail()],
  handleValidatorErrors,
  changeEmail
);

router.post(
  "/changePassword",
  auth,
  [body("oldPassword").notEmpty(), body("newPassword").notEmpty()],
  handleValidatorErrors,
  changePassword
);

export default router;
