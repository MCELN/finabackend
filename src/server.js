const express = require('express');
const router = require('./routes');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

router(app);

module.exports = app;