const bcrypt = require('bcryptjs');

const Post = require('../../models/post');
const User = require('../../models/user');

const posts = async postIds => {
    try {
      const posts = await Post.find({ _id: { $in: postIds } });
      posts.map(post => {
        return {
          ...post._doc,
          _id: post.id,
          creator: user.bind(this, post.creator)
        };
      });
      return posts;
    } catch (err) {
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
    } catch (err) {
      throw err;
    }
  };

module.exports = {
    posts: async () => {
        try {
            const posts = await Post.find();
            return posts.map(post => {
                return {
                    ...post._doc,
                    _id: post._doc._id,
                    creator: user.bind(this, post._doc.creator)
                };
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
            const result = await post.save();
            createdPost = {
                ...result._doc,
                _id: result._doc._id,
                creator: user.bind(this, result._doc.creator)
            };
            const creator = await User.findById(post.creator);  
            if (!creator) {
                throw new Error('User not found.');
            }
            creator.createdPosts.push(post);
            await creator.save();
            return createdPost;
        }
        catch (err) {
            throw err;
        }
    },
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