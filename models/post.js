const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    creator: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    text: {
        type: String,
        required: true
    }
});