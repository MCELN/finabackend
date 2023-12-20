const express = require('express');
const router = require('./routes');
const handlebars = require('express-handlebars');
const MongoConnection = require('./db');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const initializePassport = require('./config/passport.config');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const logger = require('./middlewares/logger.middleware');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Documentación de la app para el curso de backend en Coderhouse',
            description: 'La documentación es sobre el módulo de productos.',
        },
    },
    apis: [`${process.cwd()}/src/docs/**/*.yaml`],
};

const spec = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(spec));

initializePassport();
app.use(passport.initialize());

MongoConnection.getInstance();

router(app);

module.exports = app;