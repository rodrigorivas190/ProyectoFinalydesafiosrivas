//Middleware para corroborar si el usuario esta autenticado, sino redirijo a login
export function isUserOrPremium(req, res, next) {
	if (req.user.user.role === 'user' || req.user.user.role === 'premium') {
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}
