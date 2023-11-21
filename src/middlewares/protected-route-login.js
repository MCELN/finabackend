const protectedRouteLogin = async (req, res, next) => {
    const token = req.cookies.authToken;
    if (!token) {
        next();
    } else {
        return res.status(403).redirect('/products');
    };
};

module.exports = protectedRouteLogin;