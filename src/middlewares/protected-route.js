const protectedRouteSession = async (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).redirect('/products');
    };
};

module.exports = protectedRouteSession;
