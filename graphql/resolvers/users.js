const User = require('../../models/user');
const { transformUser } = require('./merge');

module.exports = {
    allUsers: async () => {
        try {
            const users = await User.find();
            return users.map(user => {
                return transformUser(user);
            });
        }
        catch (err) {
            throw err;
        }
    },
    singleUser: async args => {
        try {
            const user = await User.findById(args.userId);
            return transformUser(user);
        }
        catch (err) {
            throw err;
        }
    }
};