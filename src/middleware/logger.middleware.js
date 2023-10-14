import { createLogger, transports, format } from "winston";
import __dirname from "../dirname.util.js";
import proyectStage from "../config/environment.js";

export const logger = createLogger({
	levels: {
		fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
		http: 4,
        debug: 5
	},
	format: format.combine(
		format.simple(), 
		format.timestamp({
			format: 'YYYY-MM-DD HH:mm:ss',
			colorize: true
        }),
		format.label({
			label: `[LOGGER]` 
		}),
		format.printf(info => `${info.label} ${info.level} - ${info.timestamp} : ${info.message}`),
		format.colorize({colors: {
			fatal: "red",
            error: "magenta",
            warn: "yellow",
            info: "blue",
			http: "cyan",
            debug: "white"
		},  all: true})
	),
	transports: proyectStage === "development" ? 
	[
		new transports.Console({
			level: 'debug'
		}),
	] :
	[
		new transports.Console({
			level: 'info'
		}),
		new transports.File({
			maxsize: 512000,
			maxFiles: 5,
			filename: `${__dirname}/../logs/log-api.log`
		})
	]
});

export const addLogger = (req, res, next) => {
	req.logger = logger;
	req.logger.http(`${req.method} in ${req.url}`)
	return next()
}

