const Post = require('../../models/post');
const User = require('../../models/user');

const transformPost = post => {
    return {
        ...post._doc,
        _id: post.id,
        creator: user.bind(this, post.creator)
    };
};

const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        createdPosts: posts.bind(this, user._doc.createdPosts),
        password: null
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return transformUser(user);npm 
    }
    catch (err) {
        throw err;
    }
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

exports.transformPost = transformPost;
exports.transformUser = transformUser;