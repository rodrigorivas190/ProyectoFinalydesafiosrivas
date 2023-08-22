import jwt from 'jsonwebtoken';
const privatekey = 'privatekey';
import passport from 'passport';

const generateToken = (user) => {
	return jwt.sign({ user }, privatekey, { expiresIn: '1h' });
};

const middlewarePassportJWT = async (req, res, next) => {
	passport.authenticate('current', { session: false }, (err, usr, info) => {
		if (err) {
			return next(err);
		}

		if (!usr) {
			return res.status(401).json({ status: 'error', message: 'user/password incorrect' });
		}
		delete usr.user.password;
		req.user = usr;
		next();
	})(req, res, next);
	
};

export { generateToken, middlewarePassportJWT };
