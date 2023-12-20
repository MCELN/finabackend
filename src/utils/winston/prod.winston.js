const winston = require('winston');
const winstonCustom = require('./custom.winston');

const winstonLogger = winston.createLogger({
    levels: winstonCustom.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: winstonCustom.color }),
                winston.format.simple()
            ),
        }),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    ],
});

module.exports = winstonLogger;