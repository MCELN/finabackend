const userService = require('../Services/users.service');

const protectedRoutePremium = async (req, res, next) => {
    const user = await userService.getById(req.user._id)
    if (user && (user.role === 'premium' || user.role === 'admin')) {
        next();
    } else {
        return res.status(403).redirect('/api/products');
    };
};

module.exports = protectedRoutePremium;
