const express = require('express');
const router = require('./routes');
const MongoConnection = require('./db');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

MongoConnection.getInstance();

router(app);

module.exports = app;