class UsersDto {
    constructor(newUser) {
        this.first_name = newUser.first_name;
        this.last_name = newUser.last_name;
        this.email = newUser.email;
        this.age = newUser.age;
        this.password = newUser.password;
        this.cart = newUser.cart;
        this.verify = newUser.verify;
        this.verified = newUser.verified;
        this.status = newUser.status || true;
        this.role = newUser.role || 'user';
        this.createdAt = newUser.createdAt || Date.now();
        this.lastLoginAt = newUser.lastLoginAt || Date.now();
        this.recoverPassLink = newUser.recoverPassLink || null;
        this.recoverTime = newUser.recoverTime || null;
    };
};

module.exports = UsersDto;