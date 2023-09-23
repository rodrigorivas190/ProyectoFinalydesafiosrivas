export function isAdmin(req, res, next) {
	if (req.user.user.role === 'admin') {
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}
