import jwt from 'jsonwebtoken';
import environment from '../config/environment.js';
import CustomError from '../tools/CustomErrors.js';
import EErrors from '../tools/EErrors.js';

const validateTokenRestorePass = (req, res, next) => {
	const { token } = req.query;
	if (!token) {
		CustomError.createError({
			name: 'access prohibited',
			cause: 'access denied',
			message: 'Error trying access to the indicated route',
			code: EErrors.ROUTING_ERROR,
		});
	}

	jwt.verify(token, environment.restorepasskey, (err, user) => {
		if (err) {
			CustomError.createError({
				name: 'token expired or incorrect',
				cause: 'access denied, token expired or incorrect',
				message: 'Error trying access to the indicated route',
				code: EErrors.ROUTING_ERROR,
			});
		} else {
			next();
		}
	});
};

export { validateTokenRestorePass };
