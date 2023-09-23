import { Router } from 'express';
import { comparePassword } from '../utils/encrypt.util.js';
import passport from 'passport';
import { generateToken } from '../middleware/jwt.middleware.js';
import userController from '../controllers/user.controller.js';
import environment from '../config/environment.js';

const usersRouter = Router();

//Endpoint para registrar usuario
usersRouter.post('/', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
	//res.send({ status: 'success', message: 'user registered' });
	res.redirect('/registerok');
});

usersRouter.get('/failregister', async (req, res) => {
	res.render('registererror', {
		title: 'Error: error al registrar',
	});
});

//Endpoint para autenticar usuario y contraseña
usersRouter.post('/auth', async (req, res) => {
	const { username, password } = req.body;
	try {
		let user = await userController.getByEmail(username);
		//console.log(user);
		// Chequeo de datos
		if (username === environment.adminName && password === environment.adminPassword) {
			user = {
				first_name: 'Coder',
				last_name: 'House',
				role: 'admin',
				email: username,
			};
		}

		if (!user) {
			//Existe el usuario?
			return res.json({ status: 'error', message: 'user doesn´t exist' });
		}

		if (username != environment.adminName) {
			if (!user.password || !comparePassword(user, password)) {
				// La contraseña es correcta?
				return res.json({ status: 'error', message: 'incorrect pasword' });
			}
		}

		const token = generateToken(user);
		return res
			.cookie('token', token, {
				httpOnly: true,
				maxAge: 6000000,
			})
			.json({ status: 'success', message: 'user login authorized' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
	//res.json({ status: 'success', message: 'user login authorized' });
});

usersRouter.get('/faillogin', async (req, res) => {
	res.render('loginerror', {
		title: 'Error: error al ingresar',
	});
});

//Endpoitn para destruir sesion
usersRouter.post('/logout', (req, res) => {
	return res.clearCookie('token').redirect('/login');
});

export default usersRouter;
