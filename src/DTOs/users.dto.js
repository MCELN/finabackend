class UsersDto {
    constructor(newUser) {
        this.first_name = newUser.first_name;
        this.last_name = newUser.last_name;
        this.email = newUser.email;
        this.age = newUser.age;
        this.password = newUser.password;
        this.cart = newUser.cart;
        this.status = newUser.status || true;
        this.role = newUser.role || 'user';
        this.date = newUser.date || Date.now();
    };
};

module.exports = UsersDto;