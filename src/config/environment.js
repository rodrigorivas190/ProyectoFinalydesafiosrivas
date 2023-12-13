import dotenv from 'dotenv';
import program from './commander.js';

//defino variable por defecto
let path = '.env.dev';

//recibo por linea de comando las opciones
if (program.opts().mode === 'prod') {
	path = '.env.prod';
}

dotenv.config({ path });

//exporto variables
export default {
	//variables app
	port: process.env.PORT,
	dbName: process.env.DB_NAME,
	mongoUrl: process.env.MONGO_URL,
	mongoSessionSecret: process.env.MONGO_SESSION_SECRET,
	cookieHash: process.env.COOKIE_HASH,
	development: process.env.APP_MODE,
	hostMail: process.env.HOST_MAIL,
	proyectStage: process.env.PROYECT_STAGE,

	//variables de administrador
	adminName: process.env.ADMIN_EMAIL,
	adminPassword: process.env.ADMIN_PASSWORD,


	//variable persitencia
	persistence: process.env.PERSISTENCE,

	//variables passport
	jwtSecret: process.env.JWT_SECRET,
	gitHubClientId: process.env.GITHUB_CLIENT_ID,
	gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
	gitHubClientCallback: process.env.GITHUB_CLIENT_CALLBACK,

	//variables jwt restore pass
	restorepasskey: process.env.RESTORE_PASS_KEY,

	//variables stripe
	keyStripePrivate: process.env.KEY_STRIPE_PRIVATE,
};
