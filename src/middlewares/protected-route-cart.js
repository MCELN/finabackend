const userService = require('../Services/users.service');

const protectedRouteCart = async (req, res, next) => {
    const user = await userService.getById(req.user._id);
    if (user.cart === req.params.cid) {
        next();
    } else {
        return res.status(403).redirect('/products');
    };
};

module.exports = protectedRouteCart;
