const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    creationDate: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Comment', commentSchema);