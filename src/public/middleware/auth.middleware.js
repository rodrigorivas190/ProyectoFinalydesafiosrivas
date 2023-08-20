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
