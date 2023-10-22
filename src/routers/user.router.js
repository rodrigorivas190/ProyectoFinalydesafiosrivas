import { Router } from 'express';
import { comparePassword, hashPassword } from '../utils/encrypt.util.js';
import passport from 'passport';
import { generateToken } from '../middleware/jwt.middleware.js';
import userController from '../controllers/user.controller.js';
import environment from '../config/environment.js';
import ViewUserDTO from '../dto/viewuser.dto.js';
import { logger } from '../middleware/logger.middleware.js';

//importación de libreria de dating
import { DateTime } from 'luxon';
import { uploadGeneric } from '../middleware/uploadgeneric.middleware.js';
const documentsFolderPath = 'src/public/documents';

const usersRouter = Router();

//Endpoint para registrar usuario
usersRouter.post('/', passport.authenticate('register', { failureRedirect: 'failregister' }), async (req, res) => {
	try {
	let user = req.user
	user.last_connection = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);

	await userController.updateUser(user);
	let newUser = new ViewUserDTO(user);

	res.send({ status: 'success', payload: newUser});
	//res.redirect('/registerok');
}catch (error) {
		// console.error(error);
		logger.error(`Error de autenticacion`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
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
		let user; 
		// Chequeo de datos
		if (username === environment.adminName && password === environment.adminPassword) {
			user = {
				first_name: 'Coder',
				last_name: 'House',
				role: 'admin',
				email: username,
			};
		} else {
			user = await userController.getByEmail(username);
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

		user.last_connection = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
		if (username !== environment.adminName) {
			await userController.updateUser(user);
		}
		
		const token = generateToken(user);
		res.cookie('token', token, {
				httpOnly: true,
				maxAge: 6000000,
			})
			.send({ status: 'success', message: 'user login authorized' });
		
	} catch (error) {
		// console.error(error);
		logger.error(`Error de autenticacion`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para restablecer contraseña
usersRouter.post('/restorepass', async (req, res) => {
	const { email, password } = req.body;

	try {
		const user = await userController.getByEmail(email);

		if (!user) {
			res.json({ status: 'error', message: 'user not found' });
		}
		if (!comparePassword(user, password)) {
			user.password = hashPassword(password);
			await userController.updateUser(user);
			res.json({ status: 'success', message: 'Password update correctly' });
		} else {
			res.json({ status: 'error', message: 'Password already use' });
		}
	} catch (error) {logger.error(`Error al reestablecer la pass`);}
});

//endpoint para error de passport
usersRouter.get('/faillogin', async (req, res) => {
	res.render('loginerror', {
		title: 'Error: error al ingresar',
	});
});

//Endpoint para destruir sesion
usersRouter.post('/logout/:uid', async (req, res) => {
	const user = await userController.getById(req.params.uid); //obtengo usuario
	user.last_connection = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	await userController.updateUser(user);

	return res.clearCookie('token').redirect('/login');
});

//Endpoint para destruir sesion de admin
usersRouter.post('/logoutmasteruser', async (req, res) => {
	return res.clearCookie('token').redirect('/loginmasterusers');
});


//Endpoint para cambiar el rol de un usuario
usersRouter.get('/premium/:uid', async (req, res) => {
	try {
		const user = await userController.getById(req.params.uid); //obtengo usuario
		user.role === 'premium' ? (user.role = 'user') : (user.role = 'premium'); //Si el role es premium lo modifico a user y viceversa

		userController.updateUser(user); // actualizo usuario
		res.json({ status: 'success', message: `user ${user.email} has change his role to ${user.role}` });
	} catch (error) {
		// console.error(error);
		logger.error(`Error al cambiar el rol de los usuarios`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para  eliminar usuario
usersRouter.delete('/:uid', async (req, res) => {
	try {
		const userId = req.params.uid;
		await userController.deleteUser(userId);
		res.json({ status: 'success', message: `user ID${userId} deleted` });
	} catch (error) {
		// console.error(error);
		logger.error(`Error al eliminar los usuarios`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoitn para guardar documentación
usersRouter.post('/:uid/documents', uploadGeneric(documentsFolderPath).array('archivo'), async (req, res) => {
	try {
		const tipo = req.body.tipo; // Obtén el tipo de formulario
		const archivo = req.files; // Obtén el archivo cargado
		const user = await userController.getById(req.params.uid);
		archivo.forEach((file) => {
			const document = {
				name: file.originalname, //(Nombre del documento).
				reference: file.path, //(link al documento).
				type: tipo,
			};

			user.documents.push(document);
		});
		await userController.updateUser(user);

		if (!req.files) {
			return res.status(400).send({ status: 'error', message: 'No se pudo guardar la imagen' });
		}
		res.redirect('/profile');
	} catch (error) {
		// console.error(error);
		logger.error(`Error al guardar documentos`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para mostrar todos los usuarios
usersRouter.get('/', async (req, res) => {
	try {
		const allUsers = await userController.getAll()
		const users = allUsers.map((usr) => {
			return new ViewUserDTO(usr);
		})		
		res.json({ status: 'success', payload: users });
	} catch (error) {
		// console.error(error);
		logger.error(`Error al mostrar los usuarios`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para borrar todos los usuarios
usersRouter.delete('/', async (req, res) => {
	try {
		const users = await userController.getAll()
		
		// Función para verificar si no se ha conectado en el período especificado
		function hasNotConnectedInPeriod(user, period, unit) {
			const currentDateTime = DateTime.now();
			const lastConnectionDateTime = DateTime.fromFormat(user.last_connection, 'd/M/yyyy, HH:mm:ss');	
			const difference = currentDateTime.diff(lastConnectionDateTime, unit).toObject();
			return difference[unit] > period;
		}

		// Filtra los usuarios que no se han conectado en el período especificado y obtiene sus IDs
		const period = 2; // Por ejemplo, verifica si han pasado 2
		const unit = 'days'; // Pse puede modificar a 'hours', 'minutes', 'months', 'years', etc.
		const usersNotConnectedInPeriod = users.filter((user) => hasNotConnectedInPeriod(user, period, unit)).map((user) => user._id);

		const usersDeleted= await userController.deleteManyUser(usersNotConnectedInPeriod)
		res.json({ status: 'success', message: 'users deleted' });
	} catch (error) {
		// console.error(error);
		logger.error(`Error al filtrar los usuarios`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para actualizar un usuario
usersRouter.put('/', async (req, res) => {
	try {
		const user = req.body
		await userController.updateUser(user);		
		res.json({ status: 'success', message: "User modified"});
	} catch (error) {
		// console.error(error);
		logger.error(`Error al actualizar un usuario`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});

//Endpoint para traer un usuario por su id
usersRouter.get('/:id', async (req, res) => {
	try {
		const userId = req.params.id
		const user = await userController.getById(userId);
		const viewUser = new ViewUserDTO(user);
		
		res.json({ status: 'success', payload: viewUser});
	} catch (error) {
		// console.error(error);
		logger.error(`Error al traer un usuario`);
		res.status(500).json({ status: 'error', message: 'Internal server error' });
	}
});


export { usersRouter };
