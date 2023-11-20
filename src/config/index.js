require('dotenv').config();

module.exports = {
    port: process.env.PORT || 8080,
    environment: process.env.NODE_ENV,
    db: {
        user: process.env.DB_USER,
        pass: process.env.DB_PASS,
        host: process.env.DB_HOST,
        name: process.env.DB_NAME,
        session: process.env.DB_SESSION,
    },
    jwtKey: process.env.JWT_PRIVATE_KEY,
    github: {
        clientID: process.env.CLIENTID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackurl: process.env.CALLBACKURL,
    },
    mailer: {
        userMail: process.env.USER_MAIL,
        passMail: process.env.PASSWORD_MAIL,
    },
}