const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    signUpDate: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true
    },
    createdPosts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ],
    createdComments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);