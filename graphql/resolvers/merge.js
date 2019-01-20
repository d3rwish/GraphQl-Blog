const Post = require('../../models/post');
const User = require('../../models/user');
const Comment = require('../../models/comment');

const transformPost = post => {
    return {
        ...post._doc,
        _id: post.id,
        creator: user.bind(this, post.creator),
        comments: comments.bind(this, post.comments)
    };
};

const transformUser = user => {
    return {
        ...user._doc,
        _id: user.id,
        createdPosts: posts.bind(this, user._doc.createdPosts),
        createdComments: comments.bind(this, user._doc.createdComments),
        password: null
    };
};

const transformComment = comment => {
    return {
        ...comment._doc,
        _id: comment.id,
        creator: user.bind(this, comment.creator),
    };
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return transformUser(user);
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

const comments = async commentsIds => {
    try {
        const comments = await Comment.find({ _id: { $in: commentsIds } });
        return comments.map(comment => {
            return transformComment(comment);
        });
    }
    catch (err) {
        throw err;
    }
};

exports.transformPost = transformPost;
exports.transformUser = transformUser;
exports.transformComment = transformComment;