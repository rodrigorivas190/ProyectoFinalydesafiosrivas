import dotenv from 'dotenv';
import program from './commander.js';

//defino variable por defecto
let path = '.env';

//recibo por linea de comando las opciones
if (program.opts().mode === 'prod') {
	path = '.env';
}

dotenv.config({ path });



export default {
	port: process.env.PORT,
	mongoUrl: process.env.MONGO_URL,
	dbName: process.env.DB_NAME,
	proyectStage: process.env.PROYECT_STAGE,
	adminName: process.env.ADMIN_EMAIL,
	adminPassword: process.env.ADMIN_PASSWORD,
	persistence: process.env.PERSISTENCE,
	secretSeccion: process.env.KEY_SESSION,
	cookieParse: process.env.COOKIE_HASH,
	secretOrKey: process.env.JWSECRET,
	clientID: process.env.CLIENTID,
	clientSecret: process.env.CLIENTSECRET,
	callbackURL: process.env.CALLBACKURL,
};
