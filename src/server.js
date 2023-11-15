const express = require('express');
const router = require('./routes');
const handlebars = require('express-handlebars');
const MongoConnection = require('./db');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const initializePassport = require('./config/passport.config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

initializePassport();
app.use(passport.initialize());

MongoConnection.getInstance();

router(app);

module.exports = app;