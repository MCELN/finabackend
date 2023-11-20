const userService = require('../Services/users.service');

const protectedRouteSession = async (req, res, next) => {
    const user = await userService.getById(req.user._id)
    if (user && user.role === 'admin') {
        next();
    } else {
        return res.status(403).redirect('/products');
    };
};

module.exports = protectedRouteSession;
