const Post = require('../../models/post');
const User = require('../../models/user');
const { transformPost } = require('./merge');

module.exports = {
    posts: async () => {
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
    createPost: async args => {
        const post = new Post({
            title: args.postInput.title,
            creator: args.postInput.creator,
            createDate: new Date().toLocaleString(), // To change in the production environment. Generated on the browser side (locale Time)
            text: args.postInput.text
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