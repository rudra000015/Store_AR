import { Router } from "express";

import { validateLoginUser, validRegisterUser } from "../validators/auth.validator.js";

import { googleLogin, login, register } from "../controllers/auth.controller.js";

import passport from "passport";

const router = Router();

router.post("/register", validRegisterUser, register);

router.post("/login", validateLoginUser, login);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
  }),googleLogin
);

export default router;