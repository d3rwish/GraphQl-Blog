const Post = require('../../models/post');
const User = require('../../models/user');

const transformPost = post => {
    return {
        ...post._doc,
        _id: post.id,
        creator: user.bind(this, post.creator)
    };
};

const posts = async postIds => {
    try {
        const posts = await Post.find({ _id: { $in: postIds } });
        return posts.map(post => {
            return transformPost(post);
        });
    }
    catch (err) {
        throw err;
    }
};

const singlePost = async postId => {
    try {
        const post = await Post.findById(postId);
        return transformPost(post);
    }
    catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdPosts: posts.bind(this, user._doc.createdPosts),
            password: null
        };
    }
    catch (err) {
        throw err;
    }
};

exports.posts = posts;
exports.singlePost = singlePost;
exports.user = user;
exports.transformPost = transformPost;