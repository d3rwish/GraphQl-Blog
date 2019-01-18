const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    createDate: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Post', postSchema);