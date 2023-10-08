//importación de libreria de dating
import { DateTime } from 'luxon';

export function isAdmin(req, res, next) {
	const dateTime = DateTime.now().toLocaleString(DateTime.DATETIME_SHORT_WITH_SECONDS);
	if (req.user.user.role === 'admin') {
		req.logger.info(`${dateTime} - Admin Access ${req.user.user.firs_name} ${req.user.user.last_name} ${req.user.user.email}`);
		next();
	} else {
		res.status(403).send({ status: 'error', message: 'access denied, you do not have permission to be here' });
	}
}
