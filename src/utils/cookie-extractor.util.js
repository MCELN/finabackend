const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['authToken'];
        console.log(token)
    };

    return token;
};

module.exports = cookieExtractor;