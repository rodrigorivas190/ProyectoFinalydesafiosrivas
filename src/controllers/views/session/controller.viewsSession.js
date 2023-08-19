import { Router } from "express";
import {isGuest } from "../../../public/middleware/auth.middleware.js";
const router = Router();

router.get("/", (req, res) => {
  if (req.session?.user) {
    res.redirect("/profile");
  }

  res.render("login", {});
});

router.get("/login", isGuest, async (req, res) => {
	try {
		res.render("login");
	} catch (error) {
		res.status(400).send(error);
	}
});

router.get("/register", (req, res) => {
  if (req.session?.user) {
    res.redirect("/profile");
  }

  res.render("register", {});
});

function auth(req, res, next) {
  if (req.session?.user) return next();
  res.redirect("/");
}

router.get("/profile", auth, (req, res) => {
  const user = req.session.user;

  res.render("profile", user);
});

export default router;
