const { winstonLog } = require('../adapters/factory');

const logger = (req, res, next) => {
    req.logger = winstonLog;
    req.logger.debug(`Request: ${req.method} - ${req.url} - ${new Date().toLocaleTimeString()}`);
    next();
};

module.exports = logger;