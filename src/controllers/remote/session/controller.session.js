import { Router } from "express";
import UserModel from "../../../dao/models/model.user.js";
import userService from "../../../dao/service/User.service.js";

const router = Router();
router.post("/", async (req, res) => {
  const userData = req.body;
  try {
    const respuesta = await userService.createUser(userData);
    res.json({ status: "success", message: "user registered" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body; 
  try {
    const user = await userService.getByEmail(email);

    if (!user) {
      //Existe el usuario?
      res.json({ status: "error", message: "user doesn´t exist" });
    }
    if (user.password !== password) {
      res.json({ status: "error", message: "incorrect pasword" });
    }
    req.session.user = user;
    return res.redirect("/realTimeProducts");
    res.json({ status: "success", message: "user login authorized" });
  } catch (error) {
    //res.status(400).send(error);
  }
});

router.post("/register", async (req, res) => {
  const user = req.body;

  if (
    user.email === "adminCoder@coder.com" &&
    user.password === "adminCod3r123"
  ) {
    user.rol = "admin";
  }

  await UserModel.create(user);

  return res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
    } else {
      console.log("Sesión cerrada exitosamente");
    }
    res.redirect("/");
  });
});

export default router;
