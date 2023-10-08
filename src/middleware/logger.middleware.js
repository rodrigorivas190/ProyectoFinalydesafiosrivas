import winston from 'winston';
import environment from '../config/environment.js';
const MODEdEVELOPMENT = 'development';
const MODEpRODUCTION = 'production';

//importación de libreria de dating
import { DateTime } from 'luxon';

let logger;
const customLevelsOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		http: 4,
		debug: 5,
	},
	colors: {
		fatal: 'red',
		error: 'grey',
		warning: 'yellow',
		info: 'blue',
		http: 'cyan',
		debug: 'white',
	},
};

switch (environment.appMode) {
	case MODEdEVELOPMENT:
		logger = winston.createLogger({
			levels: customLevelsOptions.levels,
			transports: [
				new winston.transports.Console({
					level: 'debug',
					format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple()),
				}),
			],
		});
		break;
	case MODEpRODUCTION:
		logger = winston.createLogger({
			levels: customLevelsOptions.levels,
			transports: [
				new winston.transports.Console({
					level: 'info',
					format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple()),
				}),

				new winston.transports.File({
					filename: 'errors.log',
					level: 'info',
					format: winston.format.simple(),
				}),
			],
		});
		break;

	default:
		logger = winston.createLogger({
			levels: customLevelsOptions.levels,
			transports: [
				new winston.transports.Console({
					level: 'debug',
					format: winston.format.combine(winston.format.colorize({ colors: customLevelsOptions.colors }), winston.format.simple()),
				}),
			],
		});
		break;
}

export const loggerMiddleware = (req, res, next) => {
	const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	req.logger = logger;
	logger.http(`${dateTime} ${req.method} - ${req.url} - [${req.ip}] - ${req.get('user-agent')} - ${new Date().toISOString()}`);
	next();
};
