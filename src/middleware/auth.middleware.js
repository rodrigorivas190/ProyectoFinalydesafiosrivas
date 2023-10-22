//importación de libreria de dating
import { DateTime } from 'luxon';
import { logger } from '../middleware/logger.middleware.js';

//Middleware para corroborar si el usuario esta autenticado, sino redirijo a login
export function isAuth(req, res, next) {
	if (req.body.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

//Middleware para corroborar si elusuario no esta autenticado, sino lo esta redirijo a las vista de productos
export function isGuest(req, res, next) {
	if (!req.body.user) {
		next();
	} else {
		res.redirect('/products');
	}
}

//Middleware para corroborar que el usuario sea admin para ingresar a ciertas rutas
export function isAdmin(req, res, next) {
	const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	if (req.user.role === 'admin') {
		req.logger.info(`${dateTime} - Admin Access ${req.user.first_name} ${req.user.last_name} ${req.user.email}`);
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}

//Middleware para corroborar que el usuario sea premium para ingresar a ciertas rutasn
export function isPremium(req, res, next) {
try {
	if (req.user.role === 'premium') {
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}catch (error) {
    	  logger.error(`Error getting cart by: ${error}`);
    	  res.status(500).json({ status: 'error', message: 'Internal server error' });
    }}

//Middleware para corroborar que el usuario sea admin o premium para ingresar a ciertas rutas
export function isAdminOrPremium(req, res, next) {
	const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	if (req.user.role === 'admin' || req.user.role === 'premium') {
		req.logger.info(`${dateTime} - Admin/Premium Access ${req.user.first_name} ${req.user.last_name} ${req.user.email}`);
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}

//Middleware para corroborar que el usuario sea user para ingresar a ciertas rutas
export function isUser(req, res, next) {
	if (req.user.role === 'user') {
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}

//Middleware para corroborar que el usuario sea user o premium para ingresar a ciertas rutas
export function isUserOrPremium(req, res, next) {
	if (req.user.role === 'user' || req.user.role === 'premium') {
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}
