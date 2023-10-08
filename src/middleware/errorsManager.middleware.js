import EErrors from '../tools/EErrors.js';

export default (error, req, res, next) => {
	req.logger.error(error.cause);
	switch (error.code) {
		case EErrors.INVALID_TYPES_ERROR:
			res.status(400).send({ status: 'error', error: error.name });
			break;
		case EErrors.DUPLICATED_VALUE_ERROR:
			res.status(400).send({ status: 'error', error: error.name });
			break;
		case EErrors.ROUTING_ERROR:
			res.status(400).send({ status: 'error', error: error.name });
			break;
		default:
			res.status(500).send({ status: 'error', error: 'Internal Server Error' });
			break;
	}
};
