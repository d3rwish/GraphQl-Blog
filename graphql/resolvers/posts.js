const Post = require('../../models/post');
const User = require('../../models/user');
const { transformPost } = require('./merge');

module.exports = {

    // All Root Queries for Posts

    allPosts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                return transformPost(post);
            });
        }
        catch (err) {
            throw err;
        }
    },
    singlePost: async args => {
        try {
            const post = await Post.findById(args.postId);
            return transformPost(post);
        }
        catch (err) {
            throw err;
        }
    },
    userPosts: async args => {
        try {
            const posts = await Post.find({ creator: { $in: args.userId } });
            return posts.map(post => {
                return transformPost(post);
            });
        }
        catch (err) {
            throw err;
        }
    },

    // All Root Mutations for Posts

    createPost: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        // }
        const post = new Post({
            title: args.postInput.title,
            creator: args.postInput.creator,
            creationDate: new Date().toLocaleString(), // To change in the production environment. Generated on the browser side (locale Time)
            content: args.postInput.content
        });
        let createdPost;
        try {
            const creator = await User.findById(post.creator);  
            if (!creator) {
                throw new Error('User not found.');
            }
            else {
                const result = await post.save();
                createdPost = transformPost(result);
            }
            creator.createdPosts.push(post);
            await creator.save();
            return createdPost;
        }
        catch (err) {
            throw err;
        }
    }
};