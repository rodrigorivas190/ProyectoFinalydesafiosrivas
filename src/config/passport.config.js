import passport from 'passport';
import local from 'passport-local';
import { Strategy, ExtractJwt } from 'passport-jwt';
import GitHubStrategy from 'passport-github2';
import { CartModel } from '../dao/models/cart.model.js';
import userService from '../dao/service/User.service.js';
import { hashPassword, comparePassword } from '../utils/encrypt.util.js';

const jwtStrategy = Strategy;	
const jwtExtract = ExtractJwt;
const LocalStrategy = local.Strategy;



const initializePassport = () => {
	//Estrategia para registrar
	passport.use(
		'register',
		new LocalStrategy({ passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
			const { first_name, last_name, email, cartId } = req.body; // Agrega carId aquí
			try {
				let user = await userService.getByEmail(email);
				if (!user) {
					return done(null, false, { status: 'error', message: 'user already exists' });
				}
				const cart = new CartModel()
            	await cart.save()
            	const cartid = cart._id
				const newUser = {
					first_name,
					last_name,
					email,
					password: hashPassword(password),
					cartId: cartid,
					cartId, // Agrega el carId al nuevo usuario
				};
				let result = await userService.createUser(newUser);
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
				let user = await userService.getByEmail(username);
				console.log(user);
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

	passport.use(
		'current',
		new jwtStrategy(
			{
				jwtFromRequest: jwtExtract.fromExtractors([cookieExtractor]),
				secretOrKey: 'privatekey',
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
				clientID: 'Iv1.4463fc17d17c4cf5',
				clientSecret: '56f65de283d8488706bf055f9ffc6508c9f1e1ac',
				callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
			},
			async (accessToken, refreshToken, profile, done) => {
				try {
					let user = await userService.getByEmail(profile._json.email);
					if (!user) {
					const cart = new CartModel()
					await cart.save()
					const cartid = cart._id
					const newUser = {
					first_name: profile._json.name,
					last_name: "",
					cartId: cartid,
					password:"",
					email: profile._json.email,
					img: profile._json.avatar_url,
				}
					
					user = await userService.createUser(newUser);
					done(null, user);
				} else {
				// Actualiza el carId del usuario si es necesario
				if (profile._json.cartId) {
					user.cartId = profile._json.cartId;
					await user.save();
				}
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
		let user = await userService.getById(id);
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
