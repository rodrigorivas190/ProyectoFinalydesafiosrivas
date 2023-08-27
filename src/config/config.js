import dotenv from 'dotenv';

dotenv.config();

export default {
	persistence: process.env.PERSISTENCE,
	port: process.env.PORT,
	mongoUrl: process.env.MONGO_URL,
	dbName : process.env.DB_NAME,
	
};

