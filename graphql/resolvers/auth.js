const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('User already exist.');
            }
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword,
                signUpDate: new Date().toLocaleString() // To change in the production environment. Generated on the browser side (locale Time)
            });
            const result = await user.save();
            return {
                ...result._doc,
                _id: result._doc._id,
                password: null
            };
        }
        catch (err) {
            throw err;
        }
    }
};