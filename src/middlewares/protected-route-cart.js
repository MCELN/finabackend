const userService = require('../Services/users.service');

const protectedRouteCart = async (req, res, next) => {
    const user = await userService.getById(req.user._id);
    if (user && user.cart && user.cart === req.params.cid) {
        next();
    } else {
        return res.status(403).redirect('/api/products');
    };
};

module.exports = protectedRouteCart;
