import { Router } from "express";
import UserModel from "../../../dao/models/model.user.js";
const router = Router();


router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
  const user = await UserModel.findOne({ email, password });

  if (!user) return res.redirect("/");

  req.session.user = user;

  return res.redirect("/realTimeProducts");

} catch (error) {
  res.status(401).send("Ha ocurrido un error")
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
  req.session.destroy(err => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
      } else {
        console.log('Sesión cerrada exitosamente');
      }
      res.redirect("/");
  });
})



export default router;
