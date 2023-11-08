require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8080,
    environment: process.env.NODE_ENV,
}