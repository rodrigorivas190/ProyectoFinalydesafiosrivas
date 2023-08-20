import { Router } from "express";
// import UserModel from "../../../dao/models/model.user.js";
import userService from "../../../dao/service/User.service.js";
import { comparePassword } from "../../../utils/encrypt.util.js";
import passport from "passport";
import { generateToken, middlewarePassportJWT } from "../../../public/middleware/jwt.middleware.js";



const router = Router();
// router.post("/", async (req, res) => {
//   const userData = req.body;
//   try {
//     const respuesta = await userService.createUser(userData);
//     res.json({ status: "success", message: "user registered" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// router.post("/login", async (req, res) => {
//   const { email, password } = req.body; 
//   try {
//     const user = await userService.getByEmail(email);

//     if (!user) {
      
     
//       res.json({ status: "error", message: "user doesn´t exist" });
//     }
//     if (user.password !== password) {
    
//       res.json({ status: "error", message: "incorrect pasword" });
//     }
//     req.session.user = user;
  
//     res.json({ status: "success", message: "user login authorized" });
//   } catch (error) {
//     //res.status(400).send(error);
//   }
// });


// router.post("/register", async (req, res) => {
//   const user = req.body;

//   if (
//     user.email === "adminCoder@coder.com" &&
//     user.password === "adminCod3r123"
//   ) {
//     user.rol = "admin";
//   }

//   await UserModel.create(user);

//   return res.redirect("/");
// });

// router.get("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Error al cerrar sesión:", err);
//     } else {
//       console.log("Sesión cerrada exitosamente");
//     }
//     res.redirect("/");
//   });
// });

//Endpoint para registrar usuario
router.post("/", passport.authenticate("register", { failureRedirect: "failregister" }), async (req, res) => {
	//res.send({ status: 'success', message: 'user registered' });
	res.redirect("/registerok");
});

router.get("/failregister", async (req, res) => {
	res.render("registererror", {
		title: "Error: error al registrar",
	});
});

//Endpoint para autenticar usuario y contraseña
router.post("/login", async (req, res) => {
	const { username, password } = req.body;

	try {
		let user = await userService.getByEmail(username);
		//console.log(user);
		// Chequeo de datos
		if (!user) {
			//Existe el usuario?
			return res.json({ status: "error", message: "user doesn´t exist" });
		}
		//console.log('hola');
		if (!user.password || !comparePassword(user, password)) {
			// La contraseña es correcta?
			return res.json({ status: "error", message: "incorrect pasword" });
		}

		const token = generateToken(user);
		return res
			.cookie("token", token, {
				httpOnly: true,
				maxAge: 60000,
			})
			.json({ status: "success", message: "user login authorized" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", message: "Internal server error" });
	}
	//res.json({ status: 'success', message: 'user login authorized' });
});

router.get("/faillogin", async (req, res) => {
	res.render("loginerror", {
		title: "Error: error al ingresar",
	});
});

//Endpoitn para destruir sesion
router.post("/logout", (req, res) => {
	return res.clearCookie("token").redirect("/login");
});


//Endopoint para autenticar con Github
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {});

router.get("/githubcallback", passport.authenticate("github", { failureRedirect: "faillogin" }), (req, res) => {
	const token = generateToken(req.user);
	res.cookie("token", token, {
		httpOnly: true,
		maxAge: 60000,
	});
	
	return res.redirect("/realTimeProducts");
});

//Endpoint que muestra todos los productos
router.get("/current", middlewarePassportJWT, async (req, res) => {
	try {
		return res.send(req.user);
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: "error", message: "Internal server error" });
	}
});

export default router;
