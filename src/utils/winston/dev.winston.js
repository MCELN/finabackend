const winston = require('winston');
const winstonCustom = require('./custom.winston');

const winstonLogger = winston.createLogger({
    levels: winstonCustom.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: winstonCustom.color }),
                winston.format.simple()
            ),
        }),
    ],
});

module.exports = winstonLogger;