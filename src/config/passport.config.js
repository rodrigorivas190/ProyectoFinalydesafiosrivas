import passport from 'passport';
import local from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2';

import { hashPassword, comparePassword } from '../utils/encrypt.util.js';
import userController from '../controllers/user.controller.js';
import environment from './environment.js';

const jwtStrategy = Strategy;
const jwtExtract = ExtractJwt;
const LocalStrategy = local.Strategy;

const initializePassport = () => {
	//Estrategia para registrar
	passport.use(
		'register',
		new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
			const { first_name, last_name, email } = req.body;
			try {
				let user = await userController.getByEmail(email);
				if (user) {
					return done(null, false, { status: 'error', message: 'user already exists' });
				}
				const newUser = {
					first_name,
					last_name,
					email,
					password: hashPassword(password),
				};
				let result = await userController.createUser(newUser);
				return done(null, result);
			} catch (error) {
				return done('Error al obtener el usuario' + error);
			}
		})
	);

	//Estrategia login
	passport.use(
		'auth',
		new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
			try {
				let user = await userController.getByEmail(username);
				console.log(user)
				if (!user) {
					return done(null, false, { status: 'error', message: 'user not found' });
				}
				if (!comparePassword(user, password)) {
					return done(null, false, { status: 'error', message: 'Invalid data' });
				}
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		})
	);
	//estrategia para obtener sesion actual con JWT
	passport.use(
		'current',
		new jwtStrategy(
			{
				jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
				secretOrKey: environment.jwtSecret,
			},
			(payload, done) => {
				done(null, payload);
			}
		),
		async (payload, done) => {
			try {
				return done(null, payload);
			} catch (error) {
				done(error);
			}
		}
	);

	//Estrategia login con GitHub
	passport.use(
		'github',
		new GitHubStrategy(
			{
				clientID: environment.gitHubClientId,
				clientSecret: environment.gitHubClientSecret,
				callbackURL: environment.gitHubClientCallback,
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userController.getByEmail(profile._json.email);
					if (!user) {
						let newUser = {
							first_name: profile._json.name,
							last_name: '',
							email: profile._json.email,
							password: '',
							img: profile._json.avatar_url,
						};
						user = await userController.createUser(newUser);
						done(null, user);
					} else {
						done(null, user);
					}
				} catch (error) {
					done(error, false);
				}
			}
		)
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser(async (id, done) => {
		let user = await userController.getById(id);
		done(null, user);
	});
};

const cookieExtractor = (req) => {
	let token = null;
	if (req && req.cookies) {
		token = req.cookies['token'];
	}
	return token;
};

export default initializePassport;
